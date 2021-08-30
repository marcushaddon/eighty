import express, { Handler } from "express";
import { json } from "body-parser";
import OpenApi from 'swagger-ui-express';
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";
import { IDBClient, resolveDbClient } from "./db/db";
import { getRoute } from "./util";
import { loadValidator } from "./buildResourceSchemas";
import { buildInitLoggerMiddleware } from "./logging/buildInitLoggerMW";
import { buildCreateOp } from "./ops/buildCreateOp";
import { buildReplaceOp } from "./ops/buildReplaceOp";
import { buildUpdateOp } from "./ops/buildUpdateOp";
import { buildDeleteOp } from "./ops/buildDeleteOp";
import { buildGetOneOp } from "./ops/buildGetOneOp";
import { buildListOp } from "./ops/buildListOp";
import { OpBuilder } from "./ops";
import { ValidatorProvider } from "./validation/ValidatorProvider";
import { ValidatorBuilder } from "./validation";
import { buildCreateValidationMiddleware } from "./validation/buildCreateValidator";
import { ensureAuthenticated } from "./auth";
import { buildPatchValidationMiddleware } from "./validation/buildPatchValidator";
import { buildListValidationMiddleware} from "./validation/buildListValidator";
import { buildAuthorization } from "./auth/authorization";
import { buildDocs } from "./documentation";
import { OpSuccessCallback, OpSubscriber } from "./types/plugin";



export type RouteHandler = {
    method: HttpMethod,
    handler: Handler[],
    route: string,
};

export class RouterBuilder {
    private built = false;
    private readonly db: IDBClient;
    private readonly successCallbacks: {
        [ resourceName: string ]: {
            [ op: string ]: OpSuccessCallback<any>[]
        }
    } = {};

    constructor(private readonly schema: EightySchema) {
        this.db = resolveDbClient(schema.database);
    }

    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    build() {
        const resources = (this.schema.resources || []);

        // Register validators
        for (const resource of resources) {
            if (!resource.schemaPath) continue;
            
            const validator = loadValidator(resource);
            if (!validator) continue;
    
            ValidatorProvider.register(resource.schemaPath, validator);
        };
    
        const resourceRoutes = resources
            .map(resource => this.createRoutes(resource));
    
        const flattened = resourceRoutes
            .reduce((acc, current) => [ ...acc, ...current ]);
        
        const docsRouteHandlers: RouteHandler[] = [{
            method: 'use' as HttpMethod,
            route: '/docs',
            handler: OpenApi.serve,
        }, {
            method: 'get',
            route: '/docs',
            handler: [OpenApi.setup(this.buildDocs(this.schema))]
        }];

        const withDocs = [ ...flattened, ...docsRouteHandlers ];

        const router = express();
        router.use(json());

        for (const { route, handler, method } of withDocs) {
            router[method](route, ...handler);
        }
        
        // TODO: make this lazy
        const init = this.db.connect.bind(this.db);
        const tearDown = this.db.disconnect.bind(this.db);

        this.built = true;

        return { router, init, tearDown };
    };

    /**
     * Creates default get/CRUD routes for a resource,
     * overriding routes/behaviors with those specified in 
     * schema where specified.
     */
    private createRoutes(resource: Resource): RouteHandler[] {
    
        // const specifiedOps = Object.keys(resource.operations || [] as string[]);
    
        const routes = resource.operations ? (
            Object.keys(resource.operations).map(
                op => this.buildRoute(op as OperationName, resource)
            )
        ) : [];
    
        return routes;
    };

    /**
     * Builds a route by assembling default middlewares, overriding
     * modifying, or omitting each middleware where specified.
     */
    private buildRoute(op: OperationName, resource: Resource): RouteHandler {
        const middlewares: Handler[] = [];
        const operationConfig = resource.operations?.[op];

        const initLoggerMW = buildInitLoggerMiddleware(resource, op);
        middlewares.push(initLoggerMW);

        if (operationConfig?.authentication) {
            middlewares.push(ensureAuthenticated);
        }

        if (operationConfig?.authorization) {
            const authorizationMW = buildAuthorization(resource, operationConfig.authorization);
            middlewares.push(authorizationMW);
        }

        if (resource.schemaPath) {
            const validationBuilder = getValidationBuilder(op);
            const validationMW = validationBuilder(resource);
            middlewares.push(validationMW);
        }

        const opBuilder = getOpBuilder(op);

        const opMW = opBuilder({
            resource,
            db: this.db,
        });

        middlewares.push(opMW);

        // TODO: rename to plugin
        const callbacks = this.successCallbacks[resource.name]?.[op]

        if (callbacks) {
            callbacks.forEach(cb => middlewares.push(cb as Handler));
        }

        // Finisher
        middlewares.push((req, res) => {
            const status = (req as any).status || 500;
            const resource = (req as any).resource;

            return res.status(status).json(resource).end();
        });

        const { expressRoute } = getRoute(op, resource);

        return {
            route: expressRoute,
            method: opMethods[op],
            handler: middlewares
        };
    }

    private buildDocs(schema: EightySchema) {
        return buildDocs(schema);
    }

    public registerSuccessCallback(resourceName: string, op: OperationName, cb: OpSuccessCallback<any>) {
        if (this.built) {
            throw new Error('Invalid use of RouterBuilder fluent API: Op middleware plugins must be registered before calling "build()"');
        }

        if (!this.successCallbacks[resourceName]) this.successCallbacks[resourceName] = {};
        if (!this.successCallbacks[resourceName][op]) this.successCallbacks[resourceName][op] = [];
        this.successCallbacks[resourceName][op].push(cb);
    }

    public resources(resourceName: string) {
        const resource = this.schema.resources.find(rec => rec.name === resourceName);
        if (typeof resource === 'undefined') {
            throw new Error(`Eighty: unknown resource: ${resourceName}`);
        }

        const self = this;

        return {
            ops: (op: OperationName) => {
                if (!resource.operations || !(op in resource.operations)) {
                    throw new Error(`Error registering op callback, operation ${op} not specified for resource "${name}"`);
                }

                const subscriber: OpSubscriber<any> = {} as OpSubscriber<any>;
                // TODO: rename onSuccess -> something like 'afterQuery/Op' or something
                subscriber.onSuccess = handler => {
                    self.registerSuccessCallback(
                        resourceName,
                        op,
                        handler
                    );
                    return subscriber;
                };

                return subscriber;
            }
        }
    }
}

// TODO: move these to ops/
const noOpBuilder = (): Handler => {
    const noop: Handler = (req, res) => {
        res.status(404).end();
    }
    
    return noop;
}

const getOpBuilder = (op: OperationName): OpBuilder => {
    const builders: { [ k: string ]: any } = {
        list: buildListOp,
        getOne: buildGetOneOp,
        create: buildCreateOp,
        replace: buildReplaceOp,
        update: buildUpdateOp,
        delete: buildDeleteOp,
    };

    return builders[op] || noOpBuilder;
};

const noValidationBuilder = (): Handler => {
    const noValidation: Handler = (req, res, next) => {
        next();
    }

    return noValidation;
}

// TODO: Move this to validation/
const getValidationBuilder = (op: OperationName): ValidatorBuilder => {
    const builders: { [ k: string ]: ValidatorBuilder } = {
        list: buildListValidationMiddleware,
        create: buildCreateValidationMiddleware,
        replace: buildCreateValidationMiddleware,
        update: buildPatchValidationMiddleware
    };

    return builders[op] || noValidationBuilder;
};
