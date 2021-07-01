import { Handler } from "express";
import { ValidatorProvider } from "../validation/ValidatorProvider";
import { OpBuilder } from ".";
import { Schema, Validator, validate } from "jsonschema";
import { validate as validatePatch } from 'fast-json-patch';
import { UnknownFieldsPolicy } from "../types/operation";

export const buildUpdateOp: OpBuilder = ({ resource, db }): Handler => {
    const update: Handler = async (req, res, next) => {
        const resourceId = req.params.id;       
        
        // TODO: if req.authorizer, fetch and check (or in future resolve authorization query clause)
        if ((req as any).authorizer) {
            // TODO: Resolve a query clause to achieve the same thing with one less query
            const resourceInstance = db.getById(resource, resourceId);
            try {
                (req as any).authorizer((req as any).user, resourceInstance);
            } catch (e) {
                return res.status(403)
                    .send({ message: e.message })
                    .end();
            }
        }
        // TODO: apply patch op to db
        let result: any;
        try {
            result = await db.update(
                resource,
                resourceId,
                req.body,
                (req as any).user.id
            );
        } catch (e) {
            return res.status(e.status)
                .send({ message: e.message })
                .end();
        }


        return res.status(200)
            .send(result)
            .end();
    };

    return update;
}
