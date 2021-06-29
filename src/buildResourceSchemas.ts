import * as fs from 'fs';
import * as yaml from 'yaml';
import jsonschema from "jsonschema";
import { Resource } from "./types/resource";

export const loadSchema = (resource: Resource): jsonschema.Validator | undefined => {
    if (!resource.schemaPath) return;

    const file = fs.readFileSync(resource.schemaPath).toString();
    if (!(resource.schemaPath.endsWith('.yaml') || resource.schemaPath.endsWith('yml'))) {
        throw new Error('Schemas besides yaml not yet implemented!');
    }

    const parsed = yaml.parse(file);

    const schema = new jsonschema.Validator();
    schema.addSchema(parsed, resource.name);

    return schema;
}