import { Request, Response, Express } from "express";
import { OperationName } from "./operation";

export type OpSuccessCallback<T> = (req: Request & { resource: T }, res: Response) => void | Promise<void>;
export type OpFailureCallback = (req: Request & { error: Error }, res: Response) => void | Promise<void>;
export type PluginRegistrar<T> = (plugin: OpSuccessCallback<T> | OpFailureCallback) => OpsFinder<T>;
export type OpSubscriber<T> = {
    onSuccess: (callback: OpSuccessCallback<T>) => OpSubscriber<T>;
    onFailure: (callback: OpFailureCallback) => OpSubscriber<T> };
export type OpsFinder<T> = (name: OperationName) => OpSubscriber<T>;
export type ResourceFinder<T = any> = <T>(name: string) => { ops: OpsFinder<T> };

export type EightyRouter = Express & {
    resources: <T = any>(name: string) => {
        ops: OpsFinder<T>;
    }
};
