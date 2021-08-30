import { Handler } from "express";
import { IDBClient } from "../db/db";
import { Resource } from "../types/resource";

export const buildGetOneOp = ({
    resource,
    db
}: {
    resource: Resource,
    db: IDBClient,
}): Handler => {
    const getOne: Handler = async (req, res, next) => {
        const id = req.params.id;

        let result: any;
        try {
            result = await db.getById(resource, id);
        } catch (e) {
            (req as any).error = e;
            res
                .status(e.status || 500)
                .json({ message: e.message })
                .end();
            return next();
        }

        if ((req as any).authorizer) {
            try {
                (req as any).authorizer((req as any).user, result);
            } catch (e) {
                (req as any).error = e;
                res
                    .status(e.stats)
                    .json({ message: e.message })
                    .end();
                return next();
            }
        }

        (req as any).resource = result;
        (req as any).status = 200;

        return next();
    };

    return getOne;
}
