import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { NotFoundError } from '../errors';

export class MongoDbClient implements IDBClient {
    constructor() {
        const connString = process.env['POSTGRES_CONNECTION_STRING'];
        if (!connString) throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGODB_CONNECTION_STRING');
        // TODO: Connect to mongo
    }

    async list({
        resource,
        page = 1,
        pageSize = 20,
        filters
    }: ListOps): Promise<EightyRecord[]> {
        throw new Error('Not implemented');

        return [];
    }

    async getById(resource: string, id: string) {
        throw new Error('Not implemented');
        
        return { id: 'todo' } as EightyRecord;
    }
}
