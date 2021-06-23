import { MongoClient, Db, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { NotFoundError } from '../errors';

export class MongoDbClient implements IDBClient {
    private readonly connString?: string;
    private readonly dbName: string;
    private  db?: Db;
    private mongo?: MongoClient;

    constructor() {
        this.connString = process.env['MONGODB_CONNECTION_STRING'];
        this.dbName = process.env['MONGODB_DB_NAME'] || 'local';
        if (!this.connString) throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGODB_CONNECTION_STRING');
    }

    async connect(): Promise<void> {
        this.mongo = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING!);
        this.db = await this.mongo.db(this.dbName);
    }

    async disconnect(): Promise<void> {
        await this.mongo?.close(true);
    }

    async list({
        resource,
        skip = 0,
        count = 20,
        filters
    }: ListOps): Promise<EightyRecord[]> {
        throw new Error('Not implemented');

        return [];
    }

    async getById(resource: string, id: string) {
        const res = await this.db!
            .collection(resource + 's')
            .findOne({ _id: new ObjectId(id) }); // TODO: may not be able to assume valid ObjectId?

        if (!res) throw new NotFoundError(
            `${resource} with id ${id} not found`
        );

        return res;
    }

    async create(resourceName: string, resource: any): Promise<EightyRecord> {
        let res: InsertOneWriteOpResult<any>;
        try {
            res = await this.db!.collection(resourceName+'s').insertOne(resource);
        } catch (e) {
            console.error(e);
            throw e;
        }
        
        const created = res.ops[0];

        return { ...created, id: created._id }
    }
}
