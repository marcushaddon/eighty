import { Request, Response, Express } from "express";
import { OperationName } from "./operation";
export declare type OpSuccessCallback<T> = (req: Request & {
    resource: T;
}, res: Response) => void | Promise<void>;
export declare type OpFailureCallback = (req: Request & {
    error: Error;
}, res: Response) => void | Promise<void>;
export declare type PluginRegistrar<T> = (plugin: OpSuccessCallback<T> | OpFailureCallback) => OpsFinder<T>;
export declare type OpSubscriber<T> = {
    onSuccess: (callback: OpSuccessCallback<T>) => OpSubscriber<T>;
    onFailure: (callback: OpFailureCallback) => OpSubscriber<T>;
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
