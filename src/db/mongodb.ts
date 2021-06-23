import { MongoClient, Db, InsertOneWriteOpResult } from 'mongodb';
import { IDBClient, ListOps } from "./db";
import { EightyRecord } from '../types/database';
import { NotFoundError } from '../errors';

export class MongoDbClient implements IDBClient {
    private readonly dbName: string;
    private  db?: Db;
    private mongo: MongoClient;

    constructor() {
        const connString = process.env['MONGODB_CONNECTION_STRING'];
        this.dbName = process.env['MONGODB_DB_NAME'] || 'local';
        if (!connString) throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGODB_CONNECTION_STRING');
        // TODO: Connect to mongo
        this.mongo = new MongoClient(connString);
    }

    async connect(): Promise<void> {
        console.log('Connecting to mongo!');
        this.mongo = await this.mongo.connect();
        this.db = this.mongo.db(this.dbName);
        console.log('Mongo connected!!!');
    }

    async disconnect(): Promise<void> {
        console.log('Mongo disconnecting!')
        return await this.mongo.close(true);
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
        console.log('THIS', this);
        return this.db!.collection(resource).findOne({ id });
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
