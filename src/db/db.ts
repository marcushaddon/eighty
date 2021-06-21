import * as process from 'process';
import { Database, EightyRecord } from '../types/database';
import { MockDbClient } from './mockdb';
import { PostgresClient } from './postgres';
import { MongoDbClient } from './mongodb';

export type ListOps = {
    resource: string,
    page?: number | undefined,
    pageSize?: number | undefined,
    filters?: { }
}

export interface IDBClient {
    list(opts: ListOps): Promise<EightyRecord[]>;
    getById(resource: string, id: string): Promise<EightyRecord>;
}

export const resolveDbClient = (dbConfig: Database): IDBClient => {
    return DbClients.get(dbConfig.type)!();
}

export const DbClients = new Map<string, () => IDBClient>([
    [ 'mock', () => new MockDbClient() ],
    [ 'postgres', () => new PostgresClient() ],
    [ 'mongodb', () => new MongoDbClient() ],
]);

