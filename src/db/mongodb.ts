import { MongoClient, Db, InsertOneWriteOpResult, ObjectId, FilterQuery } from 'mongodb';
import { ParsedQs } from 'qs';
import { applyOperation, OperationResult } from "fast-json-patch";
import { IDBClient, ListOps } from "./db";
import { correctTypes } from "../validation";
import { EightyRecord } from '../types/database';
import { NotFoundError, BadRequestError } from '../errors';
import { PaginatedResponse } from '../types/api';
import { ValidatorProvider } from '../ValidatorProvider';
import { Operation} from 'fast-json-patch';

export class MongoDbClient implements IDBClient {
    private readonly connString?: string;
    private readonly dbName: string;
    private  db?: Db;
    private mongo?: MongoClient;

    constructor() {
        this.connString = process.env['MONGO_URL'];
        this.dbName = process.env['MONGODB_DB_NAME'] || 'local';
        if (!this.connString) throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGO_URL)');
    }

    async connect(): Promise<void> {
        this.mongo = await MongoClient.connect(process.env.MONGO_URL!);
        this.db = await this.mongo.db(this.dbName);
    }

    async disconnect(): Promise<void> {
        await this.mongo?.close(true);
    }

    async list({
        resource,
        skip = 0,
        count = 20,
        filters = {}
    }: ListOps): Promise<PaginatedResponse> {
        let filtersWithCorrectTypes = filters;
        const resourceSchema = ValidatorProvider.getValidator(resource);
        if (resourceSchema) {
            filtersWithCorrectTypes = correctTypes(filters, resourceSchema, resource.name);
        }
        const translatedFilters = translateFilters(filtersWithCorrectTypes);

        const baseQuery = this.db
            ?.collection(resource.name + 's')
            .find(translatedFilters)
        
        const res = await baseQuery!
            .skip(skip)
            .limit(count);
    
        const all = await res?.toArray();
        const transformed = (all || []).map(r => ({ ...r, id: r._id }));

        const total = await baseQuery!.count() as number;

        return {
            total: total,
            skipped: skip,
            results: transformed
        }
    }

    async getById(resource: string, id: string) {
        const res = await this.db!
            .collection(resource + 's')
            .findOne({ _id: new ObjectId(id) }); // TODO: may not be able to assume valid ObjectId?

        

        if (!res) throw new NotFoundError(
            `${resource} with id ${id} not found`
        );

        const formatted = { ...res, id: res._id.toString() };
        delete formatted._id;

        return formatted;
    }

    async create(resourceName: string, resource: any, createdBy?: string): Promise<EightyRecord> {
        let res: InsertOneWriteOpResult<any>;
        try {
            const withCreatedBy = {
                ...resource,
                createdBy
            };
            res = await this.db!.collection(resourceName+'s')
                .insertOne(withCreatedBy);
        } catch (e) {
            console.error(e);
            throw e;
        }
        
        const created = res.ops[0];

        return { ...created, id: created._id }
    }

    async update(resourceName: string, id: string, ops: Operation[]): Promise<EightyRecord> {
        // TODO: parse into mongo update ops
        const existing = await this.getById(resourceName, id);

        let results: OperationResult<any>[];
        try {
            results = ops.map(op => applyOperation(existing, op));
        } catch (e) {
            console.error('Encountered error applying patch', e);
            throw new BadRequestError(e.message);
        }

        // TODO: LOG RESULTS

        await this.replace(resourceName, existing);

        return existing;
    }

    async replace(resourceName: string, resource: EightyRecord): Promise<void> {
        const res = await this.db!.collection(resourceName+'s')!
            .replaceOne(
                { _id: new ObjectId(resource.id) },
                resource
            );
    }
}

export const translateFilters = (parsedQueryString: ParsedQs) => {
    if (!parsedQueryString) return {};

    let $and: FilterQuery<any>[] = [];
    const filters: { [ key: string ]: FilterQuery<any> | string } = {};
    // Extract filters by fields
    const keyVals = Object.entries(parsedQueryString);
    
    for (let [ key, val ] of keyVals) { 
        if (key === 'id') {
            filters['_id'] = mapIdVals(val as string | string[]);
        } else if (typeof val === 'string') {
            filters[key] = val;
        } else if (Array.isArray(val)) {
            filters[key] = { $in: val };
        } else if (val) {
            const mapped = mapFilters(val);
            if (mapped.length < 2) {
                filters[key] = mapped[0];
            } else {
                $and = [ ...$and, ...mapped ];
            }
        } else {
            console.error(`Unhandled case- ${key}: ${val}`);
        }
    }
    
    if ($and.length > 0) {
        filters['$and'] = $and;
    };

    return filters;
}

const mapIdVals = (vals: string | string[]) => {
    if (Array.isArray(vals)) {
        const $in = vals.map(v => {
            if (typeof v !== 'string')
                throw new BadRequestError(`Invalid type for id field: ${typeof v}`);
            return new ObjectId(v);
        });

        return { $in };
    } else if (typeof vals === 'string') {
        return new ObjectId(vals);
    } else {
        throw new BadRequestError(`Invalid type for id field: ${typeof vals}`);
    }
}

const mapFilters = (filterObj: ParsedQs): FilterQuery<any>[] => Object.entries(filterObj)
    .map(([ key, val ]) => {
        if (!(key in OperatorMap)) {
            throw new BadRequestError(`Unrecognized query filter: ${key}`);
        }

        return { [OperatorMap[key]]: val };
    });

const OperatorMap: { [ key: string ]: string } = {
    'lt': '$lt',
    'lte': '$lte',
    'gt': '$gt',
    'gte': '$gte',
    'exists': '$TODO',
    'in': '$in',
    // TODO: regex
}