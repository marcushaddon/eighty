import { Handler } from "express";
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { HttpMethod, Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";

export type RouteHandler = {
    method: HttpMethod,
    handler: Handler[],
    route: string,
}

export const buildRoute = (op: OperationName, resource: Resource): RouteHandler => {
    const middlewares: Handler[] = [];
    // Resolve authentication middleware
    // Resolve authorization middleware?
    // Resolve op middleware (might need to apply authorization)
    middlewares.push((req, res) => {
        return res.status(200).end();
    });

    return {
        route: `/${resource.name}`,
        method: opMethods[op],
        handler: middlewares
    };
};

export const createRoutes = (resource: Resource): RouteHandler[] => {
    
    // const specifiedOps = Object.keys(resource.operations || [] as string[]);

    const routes = Operations.map(op => buildRoute(op, resource));

    return routes;
};

export const createRoutesAndHandlers = (schema: EightySchema): RouteHandler[] => {
    const resources = (schema.resources || []);

    const resourceRoutes = resources
        .map(resource => createRoutes(resource));

    const flattened = resourceRoutes
        .reduce((acc, current) => [ ...acc, ...current ]);

    return flattened;
};
