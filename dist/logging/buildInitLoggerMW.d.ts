import { Handler } from "express";
import { OperationName } from "../types/operation";
import { Resource } from "../types/resource";
export declare const buildInitLoggerMiddleware: (resource: Resource, op: OperationName) => Handler;
