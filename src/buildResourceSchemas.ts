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

    const validator = new jsonschema.Validator();
    validator.addSchema(parsed, resource.name);
    console.log(validator.schemas);
    // TODO: Resolve and add schema for patch op under resource.name+'.PATCH'

    return validator;
}
