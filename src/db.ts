import { Database } from './types/database';

export interface IDBClient {

}

export const resolveDbClient = (dbConfig: Database): IDBClient => {
    return { } as IDBClient;
}