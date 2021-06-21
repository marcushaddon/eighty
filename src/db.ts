import * as process from 'process';
import { Database, EightyRecord } from './types/database';
import { NotFoundError } from './errors';

export interface IDBClient {
    getById(resource: string, id: string): Promise<EightyRecord>;
}

export const resolveDbClient = (dbConfig: Database): IDBClient => {
    return DbClients.get(dbConfig.type)!();
}

export class PostgresClient implements IDBClient {
    constructor() {
        const connString = process.env['POSTGRES_CONNECTION_STRING'];
        if (!connString) throw new Error('Postgres was specified as database, but no connection string was found in environment (POSTGRES_CONNECTION_STRING');
        // TODO: Connect to postgres
    }

    async getById(resource: string, id: string) {
        throw new Error('Not implemented');
        
        return { id: 'todo' } as EightyRecord;
    }
}

export class MongoDbClient implements IDBClient {
    constructor() {
        const connString = process.env['POSTGRES_CONNECTION_STRING'];
        if (!connString) throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGODB_CONNECTION_STRING');
        // TODO: Connect to mongo
    }

    async getById(resource: string, id: string) {
        throw new Error('Not implemented');
        
        return { id: 'todo' } as EightyRecord;
    }
}

export class MockDbClient implements IDBClient {
    collections: any = {
        user: {
            a: { id: 'a' }
        }
    }

    async getById(resource: string, id: string) {
        const rec = this.collections[resource]?.[id];
        if (!rec) { 
            throw new NotFoundError();
        }

        return rec;
    }
}

export const DbClients = new Map<string, () => IDBClient>([
    [ 'mock', () => new MockDbClient() ],
    [ 'postgres', () => new PostgresClient() ],
    [ 'mongodb', () => new MongoDbClient() ],
]);

