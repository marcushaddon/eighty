import { Handler } from "express";
import { OpBuilder } from ".";

export const buildReplaceOp: OpBuilder = ({ resource, db }) => {
    const replace: Handler = async (req, res, next) => {
        const resourceId = req.params.id;
        (req as any).resource = { id: resourceId }; // TODO: actually attach new resource

        try {
            await db.replace(resource, resourceId, req.body, (req as any).user?.id);
        } catch (e) {
            (req as any).error = e;
            res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error'})
                .end();
            return next();
        }
        

        res.status(200).send();
        return next();
    };
;
    return replace;
};