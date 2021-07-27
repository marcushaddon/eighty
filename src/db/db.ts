import * as process from 'process';
import * as jsonpatch from 'fast-json-patch';
import { Database, EightyRecord } from '../types/database';
import { MongoDbClient } from './mongodb';
import { PaginatedResponse } from '../types/api';
import { Resource } from '../types/resource';

export type ListOps = {
    resource: Resource,
    count?: number | undefined,
    skip?: number | undefined,
    sort: string,
    order?: 'ASC' | 'DESC'
    filters?: { }
}

export interface IDBClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    list(opts: ListOps): Promise<PaginatedResponse>;
    getById(resource: Resource, id: string): Promise<EightyRecord>;
    create(resource: Resource, pending: any, creatorId?: string): Promise<EightyRecord>;
    update(resource: Resource, resourceId: string, patch: jsonpatch.Operation[], modifierId?: string): Promise<EightyRecord | undefined>;
    replace(resource: Resource, id: string, replacement: EightyRecord, replacerId?: string): Promise<void>;
    delete(resourceName: string, id: string): Promise<void>;
}

export const resolveDbClient = (dbConfig: Database): IDBClient => {
    return DbClients.get(dbConfig.type)!();
}

export const DbClients = new Map<string, () => IDBClient>([
    // [ 'mock', () => new MockDbClient() ],
    // [ 'postgres', () => new PostgresClient() ],
    [ 'mongodb', () => new MongoDbClient() ],
]);

