import { Handler } from "express";
import { AuthorizationSchema } from "../types/authorization";
import { Resource } from "../types/resource";
export declare const buildAuthorization: (resource: Resource, config: AuthorizationSchema) => Handler;
