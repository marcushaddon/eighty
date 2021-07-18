import { Handler } from "express";
import { v4 as uuidv4 } from 'uuid';
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

        // TODO: Allow configuration of tracing
        logger.setCtx('traceId', req.headers.traceId);
        logger.setCtx('segmentId', uuidv4());

        (req as any).logger = logger;
        next();
    }
}
