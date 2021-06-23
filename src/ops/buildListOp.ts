import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Handler } from 'express';
import { IDBClient } from '../db';

const filterPageFields = (fields: any) => {
    delete fields['count'];
    delete fields['skip'];

    return fields;
}

export const buildListOp = ({
    resourceName,
    db,
}: {
    resourceName: string,
    db: IDBClient,
}): Handler => {
    return async (req, res, next) => {
        const queryParams = req.query;
        const { count: countParam, skip: skipParam } = queryParams;
        const filters = filterPageFields(queryParams);
        const count = countParam && parseInt(countParam as string) || 20;
        const skip = skipParam && parseInt(skipParam as string) || 0;

        const result = await db.list({
            resource: resourceName,
            count,
            skip,
            filters,
        });

        if ((req as any).authorizer) {
            try {
                result.results.forEach(res => (req as any).authorizer(res));
            } catch (e) {
                return res
                    .status(e.status)
                    .json({ message: e.message })
                    .end();
            }
        }

        return res
            .status(200)
            .json(result).end();
    };
}