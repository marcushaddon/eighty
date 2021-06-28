import { Handler } from 'express';
import { OpBuilder } from '.';
import { IDBClient } from '../db';
import { PaginatedResponse } from '../types/api';
import { Resource } from '../types/resource';
import { ValidatorProvider } from '../ValidatorProvider';

const filterPageFields = (fields: any) => {
    delete fields['count'];
    delete fields['skip'];

    return fields;
}

export const buildListOp: OpBuilder = ({
    resource,
    db,
}: {
    resource: Resource,
    db: IDBClient,
}): Handler => {
    return async (req, res, next) => {
        const queryParams = req.query;
        const { count: countParam, skip: skipParam } = queryParams;

        const filters = filterPageFields(queryParams);

        const count = countParam && parseInt(countParam as string) || 20;
        const skip = skipParam && parseInt(skipParam as string) || 0;

        const params = {
            resource,
            count,
            skip,
            filters,
        };

        let result: PaginatedResponse;
        try {
            result = await db.list(params);
        } catch (e) {
            return res
                .status(e.status)
                .json({ message: e.message })
                .end();
        }
        

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