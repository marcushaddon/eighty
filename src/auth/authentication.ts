import { Handler } from 'express';

export const ensureAuthenticated: Handler = (req, res, next) => {
    if (!(req as any ).user) {
        return res.status(401).send({ message: 'Unauthorized' }).end();
    }

    next();
};
