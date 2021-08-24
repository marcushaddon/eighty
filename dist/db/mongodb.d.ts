import { FilterQuery } from 'mongodb';
import { ParsedQs } from 'qs';
import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { PaginatedResponse } from '../types/api';
import { Operation } from 'fast-json-patch';
import { Resource } from '../types/resource';
export declare class MongoDbClient implements IDBClient {
    private connected;
    private readonly connString?;
    private readonly dbName;
    private db?;
    private mongo?;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    list({ resource, skip, count, sort, order, filters }: ListOps): Promise<PaginatedResponse>;
    getById(resource: Resource, id: string): Promise<any>;
    create(resource: Resource, pending: any, createdBy?: string): Promise<EightyRecord>;
    update(resource: Resource, id: string, ops: Operation[]): Promise<EightyRecord | undefined>;
    replace(resource: Resource, id: string, replacement: EightyRecord, replacerId?: string): Promise<void>;
    delete(resourceName: string, id: string): Promise<void>;
}
export declare const translateFilters: (parsedQueryString: ParsedQs) => {
    [key: string]: string | FilterQuery<any>;
};
