import { IDBClient } from "../db/db";
import { Handler } from "express";
import { Resource } from "../types/resource";

export const buildGetOneOp = ({
    resource,
    db
}: {
    resource: Resource,
    db: IDBClient,
}): Handler => {
    const op: Handler = async (req, res, next) => {
        const id = req.params.id;

        let result: any;
        try {
            result = await db.getById(resource.name, id);
        } catch (e) {
            console.error('NOT FOUND', resource.name, e);
            return res
                .status(e.status || 500)
                .json({ message: e.message })
                .end();
        }

        if ((req as any).authorizer) {
            try {
                (req as any).authorizer((req as any).user, resource);
            } catch (e) {
                return res
                    .status(e.stats)
                    .json({ message: e.message })
                    .end();
            }
        }

        return res
            .status(200)
            .json(resource)
            .end();
    };

    return op;
}
