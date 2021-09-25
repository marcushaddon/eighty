import * as jsonpatch from 'fast-json-patch';
import { Database, EightyRecord } from '../types/database';
import { PaginatedResponse } from '../types/api';
import { Resource } from '../types/resource';
export declare type ListOps = {
    resource: Resource;
    count?: number | undefined;
    skip?: number | undefined;
    sort: string;
    order?: 'ASC' | 'DESC';
    filters?: {};
};
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
export declare const resolveDbClient: (dbConfig: Database) => IDBClient;
export declare const DbClients: Map<string, () => IDBClient>;
