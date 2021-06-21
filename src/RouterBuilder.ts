import { Handler } from "express";
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";
import { IDBClient, resolveDbClient } from "./db";
import { buildGetOneOp } from "./OpBuilder";

export type RouteHandler = {
    method: HttpMethod,
    handler: Handler[],
    route: string,
}

export class RouterBuilder {
    private readonly db: IDBClient;

    constructor(private readonly schema: EightySchema) {
        this.db = resolveDbClient(schema.database);
    }

    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    createRoutesAndHandlers(): RouteHandler[] {
        const resources = (this.schema.resources || []);
    
        const resourceRoutes = resources
            .map(resource => this.createRoutes(resource));
    
        const flattened = resourceRoutes
            .reduce((acc, current) => [ ...acc, ...current ]);
    
        return flattened;
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
        let opMW: Handler;
        switch (op) {
            case 'getOne':
                opMW = buildGetOneOp({
                    resourceName: resource.name,
                    db: this.db,
                });
                break;
            default:
                opMW = (req, res) => console.log(`Unknown op: ${op}`)
        }

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
    if (op === 'get' || op === 'create') return `/${resourceName}`;
    return `/${resourceName}/:id`;
}