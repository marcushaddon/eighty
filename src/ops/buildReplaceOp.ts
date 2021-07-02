import { Handler } from "express";
import { OpBuilder } from ".";

export const buildReplaceOp: OpBuilder = ({ resource, db }) => {
    const replace: Handler = async (req, res, next) => {
        const resourceId = req.params.id;

        try {
            await db.replace(resource, resourceId, req.body, (req as any).user?.id);
        } catch (e) {

            return res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error'})
                .end();
        }
        

        res.status(200).send();
    };
;
    return replace;
};