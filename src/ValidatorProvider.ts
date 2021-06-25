import { ValidationError, Validator } from "jsonschema";
import { Resource } from "./types/resource";

export class ValidatorProvider {
    static validators: Map<string, Validator> = new Map();

    static register(path: string, validator: Validator) {
        ValidatorProvider.validators.set(path, validator);
    }

    static getValidator(resource: Resource): Validator | undefined {
        if (!resource.schemaPath) return;
        return ValidatorProvider.validators.get(resource.schemaPath!);
    }
}