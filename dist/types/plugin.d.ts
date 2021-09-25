import { Request, Response, Express, NextFunction } from "express";
import { OperationName } from "./operation";
/**
 * These are mostly for creating a type safe 'builder' /
 * fluent api for the RouterBuilder.
 */
export declare type PluginMiddleware<T> = (req: Request & {
    resource: T;
}, res: Response, next: NextFunction) => void | Promise<void>;
export declare type PluginRegistrar<T> = (plugin: PluginMiddleware<T>) => OpsFinder<T>;
export declare type OpSubscriber<T> = {
    beforeOp: (callback: PluginMiddleware<T>) => OpSubscriber<T>;
    onSuccess: (callback: PluginMiddleware<T>) => OpSubscriber<T>;
};
export declare type OpsFinder<T> = (name: OperationName) => OpSubscriber<T>;
export declare type ResourceFinder<T = any> = <T>(name: string) => {
    ops: OpsFinder<T>;
};
export declare type EightyRouter = Express & {
    resources: <T = any>(name: string) => {
        ops: OpsFinder<T>;
    };
};
