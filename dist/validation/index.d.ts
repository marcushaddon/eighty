import { Handler } from "express";
import { Resource } from "../types/resource";
export declare type ValidatorBuilder = (resource: Resource) => Handler;
import { ParsedQs } from "qs";
import { UnknownFieldsPolicy } from "../types/operation";
export declare const correctTypes: (query: ParsedQs, resource: Resource, unknownFieldPolicy: UnknownFieldsPolicy) => ParsedQs;
