import { IDBClient } from "../db/db";
import { Resource } from "../types/resource";
import { Handler } from "express";
import { createWriteStream } from "fs";
import { runInNewContext } from "vm";

export const buildCreateOp = ({
    resource,
    db
}: {
    resource: Resource,
    db: IDBClient
}): Handler => {
    const create: Handler = async (req, res, next) => {
        const pending = req.body;
        (req as any).resource = pending;

        if ((req as any).authorizer) {
            try {
                (req as any).authorizer((req as any).user, pending);
            } catch (e) {
                (req as any).error = e;
                res
                    .status(e.status)
                    .json({ message: e.message })
                    .end();
                next();
            }
        }

        let createdBy: string | undefined = undefined;
        if ((req as any).user) {
            createdBy = (req as any).user.id;
        }

        const created = await db.create(resource, pending, createdBy);

        res.status(201)
            .json(created)
            .end();
        
        (req as any).resource = created;
        return next();
    };

    return create;
};