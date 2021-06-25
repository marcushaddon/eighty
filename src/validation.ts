import { Validator } from "jsonschema";
import { ParsedQs } from "qs";

export const correctTypes = (query: ParsedQs, validator: Validator): ParsedQs => {
    // BOOKMARK: parse strings where nessecary accourting to validator.schema for each path
    // parse dotted paths into schema path style
    // see if schema contains path, if so, resolve how to parse it
    throw new Error('TODO: bookmark start here');
    return query;
}