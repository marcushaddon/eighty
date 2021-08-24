import { Handler } from "express";
import { OperationName } from "./types/operation";
import { HttpMethod } from "./const/operations";
import { EightySchema } from "./types/schema";
import { OpFailureCallback, OpSuccessCallback } from "./types/plugin";
export declare type RouteHandler = {
    method: HttpMethod;
    handler: Handler[];
    route: string;
};
export declare class RouterBuilder {
    private readonly schema;
    private readonly db;
    private readonly successCallbacks;
    constructor(schema: EightySchema);
    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    createRoutesAndHandlers(): {
        routesAndHandlers: RouteHandler[];
        init: () => Promise<void>;
        tearDown: () => Promise<void>;
    };
    /**
     * Creates default get/CRUD routes for a resource,
     * overriding routes/behaviors with those specified in
     * schema where specified.
     */
    private createRoutes;
    /**
     * Builds a route by assembling default middlewares, overriding
     * modifying, or omitting each middleware where specified.
     */
    private buildRoute;
    private buildDocs;
    registerSuccessCallback(resourceName: string, op: OperationName, cb: OpSuccessCallback<any>): void;
    registerFailureCallback(resourceName: string, op: OperationName, cb: OpFailureCallback): void;
}
