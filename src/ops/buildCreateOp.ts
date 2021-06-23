import { IDBClient } from "../db/db";
import { Handler } from "express";

export const buildCreateOp = ({
    resourceName,
    db
}: {
    resourceName: string,
    db: IDBClient
}): Handler => {
    return async (req, res, next) => {
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

        const created = await db.create(resourceName, pending);

        return res.status(201)
            .json(created)
            .end();
    };
};