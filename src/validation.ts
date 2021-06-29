import { Handler } from "express";
import { Validator } from "jsonschema";
import { ParsedQs } from "qs";
import { BadRequestError } from "./errors";
import { Operation } from "./types/operation";
import { Resource } from "./types/resource";
import { ValidatorProvider } from "./ValidatorProvider";

export const correctTypes = (query: ParsedQs, validator: Validator, resourceName: string): ParsedQs => {
    // BOOKMARK: parse strings where nessecary accourting to validator.schema for each path
    const corrected: { [ key: string ]: any} = {};
    // parse dotted paths into schema path style
    for (const path in query) {
        const translated = dottedToSchemaPath(path, resourceName);
        const fieldType = validator.schemas[translated]?.type as string;

        const converter = CONVERTERS[fieldType];
        if (!converter) {
            throw new BadRequestError(`
            Unable to filter on unknown field: ${path}.
            To filter on a field, it must be defined in the resources schema
            `);
        }

        const converted = applyConverter(converter, query[path]);

        corrected[path] = converted;
    }

    return corrected;
}

const dottedToSchemaPath = (dotted: string, resourceName: string): string => {
    return `${resourceName}#/properties/${dotted.split('.').join('/properties/')}`;
}

const applyConverter = (converter: (arg: any) => any, val: any) => {
    if (typeof val === 'string') {
        return converter(val);
    } else if (Array.isArray(val)) {
        return val.map(item => converter(item));
    } else if (typeof val === 'object') {
        const keyVals = Object.entries(val)
            .map(([ key, subVal ]) => [ key, applyConverter(converter, subVal) ]);
        
        const converted: { [ key: string ]: any } = {};
        keyVals.forEach(([ key, val ]) => converted[key] = val);
        return converted;
    } else {
        throw new Error(`Unknown filter val type ${val}`);
    }
};

const CONVERTERS: { [ fieldType: string ]: (arg: any) => any } = {
    number: parseFloat,
    string: val => val.toString(),
    // TODO: additional types
};

export type ValidationBuilder = (resource: Resource) => Handler;

export const buildCreateValidationMiddleware = (resource: Resource): Handler => {
    const validator = ValidatorProvider.getValidator(resource);
    const validate: Handler = (req, res, next) => {
        const result = validator?.validate(req.body, validator.schemas[resource.name]);
        
        if (result?.errors.length) {
            return res.status(400)
                .json({
                    message: 'Bad request.' + result.errors.map(e => `${e.property} ${e.message}`)
                }).end();
        }
        return next();
    };

    return validate;
}