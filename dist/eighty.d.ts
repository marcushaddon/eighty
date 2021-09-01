import { EightySchema } from './types/schema';
import { RouterBuilder } from './RouterBuilder';
declare type EightyOpts = {
    schema?: EightySchema;
    schemaRaw?: string;
    schemaPath?: string;
};
export declare const readFile: (fp: string) => string;
export declare const parseSchema: (contents: string) => EightySchema;
export declare const eighty: (opts: EightyOpts) => RouterBuilder;
export {};
