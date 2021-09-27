import { Request, Response, Express, Handler, NextFunction } from "express";
import { OperationName } from "./operation";
import { Logger } from "../logging/Logger";

/**
 * These are mostly for creating a type safe 'builder' /
 * fluent api for the RouterBuilder.
 */
export type PluginMiddleware<T> = (req: Request & { resource: T, logger: Logger }, res: Response, next: NextFunction) => void | Promise<void>;
export type PluginRegistrar<T> = (plugin: PluginMiddleware<T>) => OpsFinder<T>;
export type OpSubscriber<T> = {
    beforeOp: (callback: PluginMiddleware<T>) => OpSubscriber<T>
    onSuccess: (callback: PluginMiddleware<T>) => OpSubscriber<T>;
};
export type OpsFinder<T> = (name: OperationName) => OpSubscriber<T>;
export type ResourceFinder<T = any> = <T>(name: string) => { ops: OpsFinder<T> };

export type EightyRouter = Express & {
    resources: <T = any>(name: string) => {
        ops: OpsFinder<T>;
    }
};
