import * as process from 'process';
import { Database, EightyRecord } from '../types/database';
import { MockDbClient } from './mockdb';
import { PostgresClient } from './postgres';
import { MongoDbClient } from './mongodb';
import { PaginatedResponse } from '../types/api';
import { Resource } from '../types/resource';

export type ListOps = {
    resource: Resource,
    count?: number | undefined,
    skip?: number | undefined,
    filters?: { }
}

export interface IDBClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    list(opts: ListOps): Promise<PaginatedResponse>;
    getById(resource: string, id: string): Promise<EightyRecord>;
    create(resourceName: string, resource: any): Promise<EightyRecord>;
}

export const resolveDbClient = (dbConfig: Database): IDBClient => {
    return DbClients.get(dbConfig.type)!();
}

export const DbClients = new Map<string, () => IDBClient>([
    // [ 'mock', () => new MockDbClient() ],
    // [ 'postgres', () => new PostgresClient() ],
    [ 'mongodb', () => new MongoDbClient() ],
]);

