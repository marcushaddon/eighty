import { Handler } from 'express';

export const ensureAuthenticated: Handler = (req, res, next) => {
    if (!(req as any ).user) {
        (req as any).logger.error('User must be authenticated');
        return res.status(401).send({ message: 'Unauthorized' }).end();
    }

    next();
};
