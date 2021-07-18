import { Validator, Schema, validate } from "jsonschema";
import { Handler } from 'express';
import { validate as validatePatch } from "fast-json-patch";
import { ValidatorBuilder } from "./index";
import { UnknownFieldsPolicy } from "../types/operation";
import { Resource } from "../types/resource";
import { ValidatorProvider } from "./ValidatorProvider";

export const buildPatchValidationMiddleware: ValidatorBuilder = (resource: Resource) => {
    const validator = ValidatorProvider.getValidator(resource);
    let patchValidator: ((patch: any) => string[]) | undefined;
    if (validator) {
        patchValidator = buildPatchValidator(validator, resource.operations?.update?.unknownFieldsPolicy);
    }

    const validatePatchRequest: Handler = (req, res, next) => {
        const patchError = validatePatch(req.body);
        if (patchError) {
            (req as any).logger.error('Patch operation failed validation', patchError);
            return res.status(400)
                .send({ message: patchError.message })
                .end();
        }
    
        // Validate patch body specifically for resource if schema provided
        if (patchValidator) {
            const problems = patchValidator(req.body);
            if (problems.length > 0) {
                (req as any).logger.error('Patch operation failed validation for resource schema', { problems });
                return res.status(400)
                    .json({ message: 'Bad request: ' + problems.join('\n')});
            }
        }

        next();
    };

    return validatePatchRequest;
};

export const buildPatchValidator = (
    validator: Validator,
    unknownFieldsPolicy: UnknownFieldsPolicy = 'reject'
): (patches: any[]) => string[] => {

    const knownPaths: { [ path: string ]: Schema } = {};

    for (const [ path, schema ] of Object.entries(validator.schemas)) {
        const stripped = path.replace(/^\w+#/i, '');
        const deflated = stripped.replace(/\/properties/g, '');
        const clonedSchema = JSON.parse(JSON.stringify(schema));
        delete clonedSchema.required;
        knownPaths[deflated] = clonedSchema;
    }

    return (patches: any[]): string[] => {
        const problems: string[] = [];

        for (const { op, path, value } of patches) {
            if (!(path in knownPaths)) {
                if (unknownFieldsPolicy === 'reject') {
                    problems.push(`Unknown path: ${path}. Only known paths may be updated.`);
                }
                
                continue;
            }
            const schema = knownPaths[path];
            const result = validate(value, schema);
            for (const res of result.errors) {
                problems.push(`${[ path, res.path ].join('/').replace(/\/$/, '')} ${res.message}`);
            }
        }

        return problems;
    }
} 