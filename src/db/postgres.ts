import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { NotFoundError } from '../errors';

export class PostgresClient implements IDBClient {
    constructor() {
        const connString = process.env['POSTGRES_CONNECTION_STRING'];
        if (!connString) throw new Error('Postgres was specified as database, but no connection string was found in environment (POSTGRES_CONNECTION_STRING');
        // TODO: Connect to mongo?
    }

    async connect() {
        throw new Error('Not implemented');
    }

    async list({
        resource,
        skip = 1,
        count = 20
    }: ListOps): Promise<EightyRecord[]> {
        throw new Error('Not implemented');

        return [];
    }

    async getById(resource: string, id: string) {
        throw new Error('Not implemented');
        
        return { id: 'todo' } as EightyRecord;
    }

    async create(resourceName: string, resource: any): Promise<EightyRecord> {
        throw new Error('Not implemented');

        return { id: 'todo' };
    }
}
