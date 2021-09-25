import jsonschema from "jsonschema";
import { Resource } from "./types/resource";
export declare const loadValidator: (resource: Resource) => jsonschema.Validator;
export declare const loadSchema: (resource: Resource) => jsonschema.Schema | undefined;
