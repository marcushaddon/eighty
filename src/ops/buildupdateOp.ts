import { Handler } from "express";
import { ValidatorProvider } from "../ValidatorProvider";
import { OpBuilder } from ".";
import { Schema, Validator, validate } from "jsonschema";
import { validate as validatePatch } from 'fast-json-patch';
import { endianness } from "os";

export const buildUpdateOp: OpBuilder = ({ resource, db }): Handler => {
    const validator = ValidatorProvider.getValidator(resource);
    let patchValidator: ((patch: any) => string[]) | undefined;
    if (validator) {
        patchValidator = buildPatchValidator(validator);
    }
    
    const update: Handler = async (req, res, next) => {
        const resourceId = req.params.id;
        // TODO: Validate patch body
        const patchError = validatePatch(req.body);
        if (patchError) {
            return res.status(400)
                .send({ message: patchError.message })
                .end();
        }
        
        
        // Validate patch body specifically for resource if schema provided
        if (patchValidator) {
            const problems = patchValidator(req.body);
            if (problems.length > 0) {
                return res.status(400)
                    .json({ message: 'Bad request: ' + problems.join('\n')});
            }
        }
        // TODO: if req.authorizer, fetch and check (or in future resolve authorization query clause)
        if ((req as any).authorizer) {
            // TODO: Resolve a query clause to achieve the same thing with one less query
            const resourceInstance = db.getById(resource.name, resourceId);
            try {
                (req as any).authorizer((req as any).user, resourceInstance);
            } catch (e) {
                return res.status(403)
                    .send({ message: e.message })
                    .end();
            }
        }
        // TODO: apply patch op to db
        const result = await db.update(resource.name, req.body, (req as any).user.id);

        return res.status(204)
            .json(result)
            .end();
    };

    return update;
}

export const buildPatchValidator = (validator: Validator): (patch: any[]) => string[] => {
    const validPaths: { [ path: string ]: Schema } = {};
    // TODO: populate validPaths
    for (const [ path, schema ] of Object.entries(validator.schemas)) {
        const stripped = path.replace(/^\w+#/i, '');
        const deflated = stripped.replace(/\/properties/g, '');
        validPaths[deflated] = schema;
    }

    return (patch: any[]): string[] => {
        const problems: string[] = [];
        for (const { op, path, value } of patch) {
            if (!(path in validPaths)) {
                problems.push(`${path} is not a valid PATCH path`);
                continue;
            }

            const schema = validPaths[path];
            const result = validate(value, schema);
            for (const res of result.errors) {
                problems.push(`${[ path, res.path ].join('/').replace(/\/$/, '')} ${res.message}`);
            }
        }

        return problems;
    }
} 