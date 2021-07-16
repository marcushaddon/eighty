import * as fs from 'fs';
import * as yaml from 'yaml';
import { json } from 'body-parser';
import express, { Handler } from 'express';
import { EightySchema, EightySchemaValidator } from './types/schema';
import { RouterBuilder } from './RouterBuilder';
import { buildChecklist } from './documentation';
import { OperationName } from './types/operation';
import { EightyRouter, OpSubscriber, ResourceFinder } from './types/plugin';

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

export const readFile = (fp: string) => fs.readFileSync(fp).toString();


export const parseSchema = (contents: string): EightySchema => {
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

    const middlewareReport: string[][] = [];
 
    for (const { route, handler, method } of routesAndHandlers) {
        middlewareReport.push([ method, route, handler.map(h => h.name).join('->') ])
        router[method](route, ...handler);
    }

    // This should maybe happen after registering 'plugins'
    console.table(middlewareReport);

    const devChecklist = buildChecklist(schema);
    console.table(devChecklist);

    const resourceFinder: ResourceFinder<any> = (resourceName: string) => {
        const resource = schema.resources.find(rec => rec.name === resourceName);
        if (typeof resource === 'undefined') {
            throw new Error(`Eighty: unknown resource: ${resourceName}`);
        }

        return {
            ops: (op: OperationName) => {
                if (!resource.operations || !(op in resource.operations)) {
                    throw new Error(`Error registering op callback, operation ${op} not specified for resource "${name}"`);
                }

                const subscriber: OpSubscriber<any> = {} as OpSubscriber<any>;
                subscriber.onSuccess = cb => {
                    routerBuilder.registerSuccessCallback(
                        resourceName,
                        op,
                        cb
                    );
                    return subscriber;
                };
                subscriber.onFailure = cb => {
                    routerBuilder.registerFailureCallback(
                        resourceName,
                        op,
                        cb,
                    )
                    return subscriber;
                }

                return subscriber;
            }
        }
    }

    (router as any).resources = resourceFinder;

    return {
        init,
        tearDown,
        router: router as EightyRouter
    };
};
