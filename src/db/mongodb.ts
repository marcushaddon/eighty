import { MongoClient, Db, InsertOneWriteOpResult, ObjectId, FilterQuery } from 'mongodb';
import { ParsedQs } from 'qs';
import { applyOperation, OperationResult } from "fast-json-patch";
import { IDBClient, ListOps } from "./db";

import { EightyRecord } from '../types/database';
import { NotFoundError, BadRequestError } from '../errors';
import { PaginatedResponse } from '../types/api';
import { ValidatorProvider } from '../validation/ValidatorProvider';
import { Operation} from 'fast-json-patch';
import { Resource } from '../types/resource';

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
        sort,
        order = 'ASC',
        filters = {}
    }: ListOps): Promise<PaginatedResponse> {
        const translatedFilters = translateFilters(filters);

        let baseQuery = this.db
            ?.collection(resource.name + 's')
            .find(translatedFilters)

        if (sort) {
            const orderParam = order === 'ASC' ? 1 : -1;
            baseQuery = baseQuery
                ?.sort({ [sort]: orderParam });
        }
        
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

    async getById(resource: Resource, id: string) {
        const res = await this.db!
            .collection(resource.name + 's')
            .findOne({ _id: new ObjectId(id) }); // TODO: may not be able to assume valid ObjectId?

        if (!res) throw new NotFoundError(
            `${resource.name} with id ${id} not found`
        );

        const formatted = { ...res, id: res._id.toString() };
        delete formatted._id;

        return formatted;
    }

    async create(resource: Resource, pending: any, createdBy?: string): Promise<EightyRecord> {
        let res: InsertOneWriteOpResult<any>;
        try {
            const withCreatedBy = {
                ...pending,
                createdBy
            };
            res = await this.db!.collection(resource.name+'s')
                .insertOne(withCreatedBy);
        } catch (e) {
            console.error(e);
            throw e;
        }
        
        const created = res.ops[0];

        return { ...created, id: created._id }
    }

    async update(resource: Resource, id: string, ops: Operation[]): Promise<EightyRecord | undefined> {
        // TODO: parse into mongo update ops?
        const existing = await this.getById(resource, id);

        let results: OperationResult<any>[] = [];
        for (const op of ops) {
            try {
                results.push(applyOperation(existing, op));
            } catch (e) {
                if (e.name === 'TEST_OPERATION_FAILED') return;
                console.error(e.name, e.message, ops);
                throw new BadRequestError(`Encountered ${e.name} applying patch: ${e.message}`);
            }
        }

        const validator = ValidatorProvider.getValidator(resource);
        if (validator) {
            const result = validator.validate(existing, validator.schemas[resource.name]);
            if (!result.valid) {
                const formatted = result.errors
                    .map(err => err.toString())
                    .join('. ')
                throw new BadRequestError(`Error updating resource: ${formatted}`)
            }
        }
        // TODO: LOG RESULTS

        await this.replace(resource, existing.id, existing);

        return existing;
    }

    async replace(resource: Resource, id: string, replacement: EightyRecord, replacerId?: string): Promise<void> {
        const res = await this.db!.collection(resource.name+'s')!
            .replaceOne(
                { _id: new ObjectId(id) },
                replacement
            );
    }

    async delete(resourceName: string, id: string): Promise<void> {
        await this.db!.collection(resourceName+'s')
            .deleteOne({ _id: new ObjectId(id) });
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
    } else if (typeof vals === 'object') {
        throw new Error('[in] notation for id field to be implemented!')
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