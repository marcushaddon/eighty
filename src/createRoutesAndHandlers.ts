import { Handler } from "express";
import { Resource } from "./types/resource";
import { OperationName } from "./types/operation";
import { Operations, opMethods } from "./const/operations";
import { EightySchema } from "./types/schema";

export type RouteHandler = {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    handler: Handler[],
    route: string,
}

export const buildRoute = (op: OperationName, resource: Resource) => {
    // Resolve authentication middleware
    // Resolve authorization middleware?
    // Resolve op middleware (might need to apply authorization)
}

export const createRoutes = (resource: Resource): RouteHandler[] => {
    
    const specifiedOps = Object.keys(resource.operations || [] as string[]);

    const routes = Operations.map(op => buildRoute(op, resource));

    return routes;
}

export const createRoutesAndHandlers = (schema: EightySchema): RouteHandler[] => {
    const resources = (schema.resources || []);

    const resourceRoutes = resources
        .map(resource => createRoutes(resource));

    const flattened = resourceRoutes
        .reduce((acc, current) => [ ...acc, ...current ]);

    return flattened;
}