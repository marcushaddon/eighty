import { IDBClient } from "../db/db";
import { Resource } from "../types/resource";
import { Handler } from "express";
import { createWriteStream } from "fs";

export const buildCreateOp = ({
    resource,
    db
}: {
    resource: Resource,
    db: IDBClient
}): Handler => {
    const create: Handler = async (req, res, next) => {
        const pending = req.body;

        if ((req as any).authorizer) {
            try {
                (req as any).authorizer((req as any).user, pending);
            } catch (e) {
                return res
                    .status(e.status)
                    .json({ message: e.message })
                    .end();
            }
        }

        const created = await db.create(resource.name, pending);

        return res.status(201)
            .json(created)
            .end();
    };

    return create;
};