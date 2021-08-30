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
            (req as any).error = e;
            res
                .status(e.status || 500)
                .json({ message: e.message || 'Internal server error' + e })
                .end();
            return next();
        }
        
        (req as any).resource = result;

        if ((req as any).authorizer) {
            try {
                result.results.forEach(res => (req as any).authorizer(res));
            } catch (e) {
                (req as any).error = e;
                res
                    .status(e.status || 500)
                    .json({ message: e.message || 'Internal server error' + e })
                    .end();
                return next();
            }
        }

        (req as any).status = 200;
        (res as any).resource = result;
            
        return next();
    };

    return list;
}