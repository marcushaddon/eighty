import { Validator } from "jsonschema";
import { ParsedQs } from "qs";
import { translateFilters } from "./db";

export const correctTypes = (query: ParsedQs, validator: Validator, resourceName: string): ParsedQs => {
    // BOOKMARK: parse strings where nessecary accourting to validator.schema for each path
    const corrected = {};
    // parse dotted paths into schema path style
    for (const path in query) {
        const translated = dottedToSchemaPath(path, resourceName);
        const fieldType = validator.schemas[translated]?.type as string;
        console.log(path, '->', translated, 'should be', fieldType);
        const converter = CONVERTERS[fieldType];
        if (!converter) {
            throw new Error(`Unknown field type: ${fieldType}`);
        }

        // TODO: handle raw values AND { gt: '40' } etc
        const converted = converter(query[path]);

        console.log(query[path], 'at', path, '->', translated, 'should be', fieldType, 'is now', converted);
    }
    // see if schema contains path, if so, resolve how to parse it
    // throw new Error('TODO: bookmark start here');
    return query;
}

const dottedToSchemaPath = (dotted: string, resourceName: string): string => {
    return `${resourceName}#/properties/${dotted.split('.').join('/')}`;
}

const CONVERTERS: { [ fieldType: string ]: (arg: any) => any } = {
    Integer: parseInt
}