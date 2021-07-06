import { Handler } from 'express';
import { OpBuilder } from '.';
import { IDBClient } from '../db';
import { PaginatedResponse } from '../types/api';
import { Resource } from '../types/resource';

export const buildListOp: OpBuilder = ({
    resource,
    db,
}: {
    resource: Resource,
    db: IDBClient,
}): Handler => {
    const list: Handler = async (req, res, next) => {
        const {
            count,
            skip,
            filters,
            sort,
            order
        } = req as any;

        const params = {
            resource,
            count,
            skip,
            sort,
            order: order ? order.toUpperCase() : order,
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

    return list;
}