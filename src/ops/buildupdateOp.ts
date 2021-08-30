import { Handler } from "express";
import { ValidatorProvider } from "../validation/ValidatorProvider";
import { OpBuilder } from ".";
import { Schema, Validator, validate } from "jsonschema";
import { validate as validatePatch } from 'fast-json-patch';
import { UnknownFieldsPolicy } from "../types/operation";

export const buildUpdateOp: OpBuilder = ({ resource, db }): Handler => {
    const update: Handler = async (req, res, next) => {
        const resourceId = req.params.id;       

        if ((req as any).authorizer) {
            // TODO: Resolve a query clause to achieve the same thing with one less query
            const resourceInstance = await db.getById(resource, resourceId);
            try {
                (req as any).authorizer((req as any).user, resourceInstance);
            } catch (e) {
                (req as any).error = e;
                res.status(403)
                    .send({ message: e.message })
                    .end();
                return next();
            }
        }

        let result: any;
        try {
            result = await db.update(
                resource,
                resourceId,
                req.body,
                (req as any).user.id
            );
        } catch (e) {
            (req as any).error = e;
            res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error' })
                .end();
            return next();
        }

        (req as any).resource = result;
        (req as any).status = 200

        return next();
    };

    return update;
}
