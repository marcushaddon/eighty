import * as fs from 'fs';
import * as yaml from 'yaml';
import { json } from 'body-parser';
import express, { Handler } from 'express';
import { EightySchema, EightySchemaValidator } from './types/schema';
import { RouterBuilder } from './RouterBuilder';
import { boolOptions } from 'yaml/types';

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

export const eighty = (opts: EightyOpts) => {
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

    const routerBuilder = new RouterBuilder(schema);
    
    const {
        routesAndHandlers,
        init,
        tearDown,
    } = routerBuilder.createRoutesAndHandlers();

    const router = express();
    router.use(json());
 
    for (const { route, handler, method } of routesAndHandlers) {
        console.log(route, handler.map(h => h.name), method, 'REGISTERING');
        router[method](route, ...handler);
    }

    return { init, tearDown, router };
};
