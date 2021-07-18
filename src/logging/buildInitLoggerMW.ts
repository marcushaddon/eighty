import { Handler } from "express";
import { OperationName } from "../types/operation";
import { Resource } from "../types/resource";
import { Logger } from "./Logger";

export const buildInitLoggerMiddleware = (resource: Resource, op: OperationName): Handler => {
    return async (req, res, next) => {
        const logger = new Logger({
            resource: resource.name,
            operation: op,
            method: req.method,
            url: req.url,
            params: req.params,
        });

        (req as any).logger = logger;
        next();
    }
}
