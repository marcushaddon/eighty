import { Validator } from "jsonschema";
import { Resource } from "../types/resource";
export declare class ValidatorProvider {
    static validators: Map<string, Validator>;
    static register(path: string, validator: Validator): void;
    static getValidator(resource: Resource): Validator | undefined;
}
