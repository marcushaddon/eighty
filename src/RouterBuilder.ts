import { Handler } from "express";
import OpenApi from 'swagger-ui-express';
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";
import { IDBClient, resolveDbClient } from "./db/db";
import { getRoute } from "./util";
import { loadSchema } from "./buildResourceSchemas";
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
import { OpFailureCallback, OpSuccessCallback } from "./types/plugin";



export type RouteHandler = {
    method: HttpMethod,
    handler: Handler[],
    route: string,
}

export class RouterBuilder {
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
    createRoutesAndHandlers() {
        const resources = (this.schema.resources || []);

        // Register validators
        for (const resource of resources) {
            if (!resource.schemaPath) continue;
            
            const validator = loadSchema(resource);
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
        
        // TODO: make this lazy
        const init = this.db.connect.bind(this.db);
        const tearDown = this.db.disconnect.bind(this.db);
    
        return { routesAndHandlers: withDocs, init, tearDown };
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

        const self = this;

        //  TODO: Add middlware for running registered callbacks
        middlewares.push(async function maybeRunCallbacks(req, res) {
            // TODO: check for error
            const { error, resource: opResource } = req as any;
            if (error) {
                
            } else {
                const callbacks = self.successCallbacks[resource.name]?.[op];
                callbacks && await Promise.all(callbacks.map(cb => cb(req as any, res)))
            }
        })

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
        if (!this.successCallbacks[resourceName]) this.successCallbacks[resourceName] = {};
        if (!this.successCallbacks[resourceName][op]) this.successCallbacks[resourceName][op] = [];
        this.successCallbacks[resourceName][op].push(cb);
    }

    public registerFailureCallback(resourceName: string, op: OperationName, cb: OpFailureCallback) {
        // TODO: Register + add final middleware to appropriate route that runs all registered callbacks
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
