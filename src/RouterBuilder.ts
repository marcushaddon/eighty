import { Handler } from "express";
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";
import { IDBClient, resolveDbClient } from "./db/db";
import { loadSchema } from "./buildResourceSchemas";
import { buildGetOneOp } from "./ops/buildGetOneOp";
import { buildListOp } from "./ops/buildListOp";
import { OpBuilder } from "./ops";
import { ValidatorProvider } from "./validation/ValidatorProvider";
import { buildCreateOp } from "./ops/buildCreateOp";
import { buildUpdateOp } from "./ops/buildUpdateOp";
import { ValidatorBuilder } from "./validation";
import { buildCreateValidationMiddleware } from "./validation/buildCreateValidator";
import { ensureAuthenticated } from "./auth";
import { buildPatchValidationMiddleware } from "./validation/buildPatchValidator";
import { buildReplaceOp } from "./ops/buildReplaceOp";


export type RouteHandler = {
    method: HttpMethod,
    handler: Handler[],
    route: string,
}

export class RouterBuilder {
    private readonly db: IDBClient;

    constructor(private readonly schema: EightySchema) {
        this.db = resolveDbClient(schema.database);
        // TODO: Surface async init method
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
        }
    
        const resourceRoutes = resources
            .map(resource => this.createRoutes(resource));
    
        const flattened = resourceRoutes
            .reduce((acc, current) => [ ...acc, ...current ]);
        
        const init = this.db.connect.bind(this.db);
        const tearDown = this.db.disconnect.bind(this.db);
    
        return { routesAndHandlers: flattened, init, tearDown };
    };

    /**
     * Creates default get/CRUD routes for a resource,
     * overriding routes/behaviors with those specified in 
     * schema where specified.
     */
    private createRoutes(resource: Resource): RouteHandler[] {
    
        // const specifiedOps = Object.keys(resource.operations || [] as string[]);
    
        // TODO: make this opt in?
        const routes = Operations.map(op => this.buildRoute(op, resource));
    
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
        // TODO: Resolve authorization middleware?
        // Resolve validation middleware
        if (resource.schemaPath) {
            const validationBuilder = getValidationBuilder(op);
            const validationMW = validationBuilder(resource);
            middlewares.push(validationMW);
        }
        // Resolve op middleware (might need to apply authorization)
        const opBuilder = getOpBuilder(op);
        
        const opMW = opBuilder({
            resource,
            db: this.db,
        });

        middlewares.push(opMW);

        return {
            route: getRoute(op, resource.name),
            method: opMethods[op],
            handler: middlewares
        };
    };
}

// TODO: maybe this should be with ops
const getRoute = (op: OperationName, resourceName: string): string => {
    if (op === 'list' || op === 'create') return `/${resourceName}s`;
    return `/${resourceName}s/:id`;
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
        create: buildCreateValidationMiddleware,
        replace: buildCreateValidationMiddleware,
        update: buildPatchValidationMiddleware
    };

    return builders[op] || noValidationBuilder;
}