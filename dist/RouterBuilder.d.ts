import { Handler } from "express";
import { OperationName } from "./types/operation";
import { HttpMethod } from "./const/operations";
import { EightySchema } from "./types/schema";
import { OpSuccessCallback, OpSubscriber } from "./types/plugin";
export declare type RouteHandler = {
    method: HttpMethod;
    handler: Handler[];
    route: string;
};
export declare class RouterBuilder {
    private readonly schema;
    private built;
    private readonly db;
    private readonly successCallbacks;
    constructor(schema: EightySchema);
    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    build(): {
        router: import("express-serve-static-core").Express;
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
    resources(resourceName: string): {
        ops: (op: OperationName) => OpSubscriber<any>;
    };
}
