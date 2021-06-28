import { Handler } from "express";
import { ValidationError } from "jsonschema";
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";
import { IDBClient, resolveDbClient } from "./db/db";
import { loadSchema } from "./buildResourceSchemas";
import { buildGetOneOp } from "./ops/buildGetOneOp";
import { buildListOp } from "./ops/buildListOp";
import { OpBuilder } from "./ops";
import { ValidatorProvider } from "./ValidatorProvider";


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
    
        const routes = Operations.map(op => this.buildRoute(op, resource));
    
        return routes;
    };

    /**
     * Builds a route by assembling default middlewares, overriding
     * modifying, or omitting each middleware where specified.
     */
    private buildRoute(op: OperationName, resource: Resource): RouteHandler {
        const middlewares: Handler[] = [];
        // Resolve authentication middleware
        // Resolve authorization middleware?
        // Resolve op middleware (might need to apply authorization)
        const opBuilder = getOpBuilder(op);
        
        const opMW: Handler = opBuilder({
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

const noOpBuilder = (): Handler => (req, res) => console.log(`Unknown op}`);

const getOpBuilder = (op: OperationName): OpBuilder => {
    const builders: { [ k: string ]: any } = {
        list: buildListOp,
        getOne: buildGetOneOp,
    };

    return builders[op as string] || noOpBuilder;
};