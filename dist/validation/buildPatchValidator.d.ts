import { Validator } from "jsonschema";
import { ValidatorBuilder } from "./index";
import { UnknownFieldsPolicy } from "../types/operation";
export declare const buildPatchValidationMiddleware: ValidatorBuilder;
export declare const buildPatchValidator: (validator: Validator, unknownFieldsPolicy?: UnknownFieldsPolicy) => (patches: any[]) => string[];
