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

    async connect() {}

    async list({
        resource,
        skip = 0,
        count = 20,
        filters,
    }: ListOps): Promise<EightyRecord[]> {
        const res = Object.values(this.collections[resource]).slice(skip, skip + count);

        return res as EightyRecord[];
    }

    async getById(resource: string, id: string) {
        const rec = this.collections[resource]?.[id];
        if (!rec) {
            throw new NotFoundError();
        }

        return rec;
    }

    async create(resourceName: string, resource: any) {
        throw new Error('Not implemented');

        return { id: 'todo' };
    }
}