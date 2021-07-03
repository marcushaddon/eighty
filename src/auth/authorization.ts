import { Handler } from "express";
import { AuthorizationSchema } from "../types/authorization";
import { Resource } from "../types/resource";

// export type AuthorizationBuilder = (resource: Resource, config: AuthorizationSchema) => Handler;
export type AuthorizationBuilder = (foo: string) => void;
