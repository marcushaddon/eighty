import * as fs from 'fs';
import * as yaml from 'yaml';
import express, { Request, Express, Router, Handler } from 'express';
import { EightySchema, EightySchemaValidator } from './types/schema';
import { createRoutesAndHandlers } from './createRoutesAndHandlers';

type EightyOpenApiHandler = {
    route: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    handler: Handler,
    authenticate?: { }
};

type EightyOpts = {
    schema?: EightySchema,
    schemaRaw?: string,
    schemaPath?: string,
};

const readFile = (fp: string) => fs.readFileSync(fp).toString();


const parseSchema = (contents: string): EightySchema => {
    const parsed = yaml.parse(contents);

    return EightySchemaValidator.check(parsed);
};

export const eighty = (opts: EightyOpts): Express => {
    let schema: EightySchema;
    if (opts.schema) {
        schema = opts.schema;
    } else if (opts.schemaRaw) {
        schema = parseSchema(opts.schemaRaw);
    } else if (opts.schemaPath) {
        const contents = readFile(opts.schemaPath);
        schema = parseSchema(contents);
    } else {
        throw new Error('One of schema | schemaRaw | schema path is required');
    }
    
    const routesAndHandlers = createRoutesAndHandlers(schema);

    const router = express();
 
    for (const { route, handler, method } of routesAndHandlers) {
        router[method](route, handler);
    }

    return router;
};
