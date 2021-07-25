import * as fs from 'fs';
import * as yaml from 'yaml';
import jsonschema from "jsonschema";
import * as TJS from 'typescript-json-schema';
import { Resource } from "./types/resource";

export const loadValidator = (resource: Resource): jsonschema.Validator => {
    const validator = new jsonschema.Validator();

    const schema = loadSchema(resource);
    
    validator.addSchema(schema, resource.name);

    return validator;
};


export const loadSchema = (resource: Resource): jsonschema.Schema | undefined => {
    if (!resource.schemaPath) return;
    let schema: jsonschema.Schema;
    if (resource.schemaPath.endsWith('.yaml') || resource.schemaPath.endsWith('.yml')) {
        schema = loadYAMLSchema(resource.schemaPath);
    } else if (resource.schemaPath.endsWith('.ts')) {
        schema = loadTSSchema(resource);
    } else { throw new Error('Unsuported resource schema type'); }

    return schema;
}

const loadYAMLSchema = (path: string): jsonschema.Schema => {
    const file = fs.readFileSync(path).toString();
    const parsed = yaml.parse(file);

    return parsed;
};

const memos: any = {};

const loadTSSchema = (resource: Resource): jsonschema.Schema => {
    if (!resource.schemaPath) return {};

    const typeName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);

    if (memos[resource.schemaPath]) return memos[resource.schemaPath];

    const program = TJS.getProgramFromFiles([resource.schemaPath!]);

    const schema = TJS.generateSchema(program, typeName, { required: true });

    if (!schema) {
        throw new Error(`Unable to parse schema for resource ${resource.name} from Typescript file ${resource.schemaPath}`);
    }

    memos[resource.schemaPath] = schema;

    return schema as jsonschema.Schema;
}