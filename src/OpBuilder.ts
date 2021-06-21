import { OperationName } from "./types/operation";
import { IDBClient } from "./db";
import { Handler } from "express";

export const buildGetOneOp = ({
    resourceName,
    db
}: {
    resourceName: string,
    db: IDBClient,
}): Handler => {
    const op: Handler = async (req, res, next) => {
        console.log('GETTTING ONE', resourceName, req.params.id); 
        const id = req.params.id;

        let resource: any;
        try {
            resource = await db.getById(resourceName, id);
        } catch (e) {
            console.error('NOT FOUND', e);
            return res
                .status(e.status)
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
