import { Handler } from "express";
import { OpBuilder } from ".";

export const buildDeleteOp: OpBuilder = ({ resource, db }): Handler => {
    const deleteOne: Handler = async (req, res, next) => {
        const id = req.params.id;
        (req as any).resource = { id };

        try {
            await db.delete(resource.name, id);
        } catch (e) {
            (req as any).error = e;
            res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error' })
                .end();
            return next();
        }

        res.status(204).end();
        return next();
    };

    return deleteOne;
}
