import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { NotFoundError } from '../errors';

export class MockDbClient implements IDBClient {
    collections: any = {
        user: {
            a: { id: 'a' },
            b: { id: 'b' },
            c: { id: 'c' },
            d: { id: 'd' }
        }
    }

    async list({
        resource,
        page = 1,
        pageSize = 20,
        filters,
    }: ListOps): Promise<EightyRecord[]> {
        const res = Object.values(this.collections[resource]);

        return res as EightyRecord[];
    }

    async getById(resource: string, id: string) {
        const rec = this.collections[resource]?.[id];
        if (!rec) {
            throw new NotFoundError();
        }

        return rec;
    }
}