import { Handler } from "express";
import { Resource } from "../types/resource";

export type ValidatorBuilder = (resource: Resource) => Handler;

import { Validator } from "jsonschema";
import { ParsedQs } from "qs";
import { BadRequestError } from "../errors";
import { UnknownFieldsPolicy } from "../types/operation";
import { ValidatorProvider } from "./ValidatorProvider";

type FieldType = 'string' | 'number' | 'array'; // TODO: additional types from JSON schema

// TODO: Put this in file specific to list validation/parsing
// TODO: This should be middleware
export const correctTypes = (query: ParsedQs, resource: Resource, unknownFieldPolicy: UnknownFieldsPolicy): ParsedQs => {
    const validator = ValidatorProvider.getValidator(resource);
    if (!validator) {

        return query;
    }
    const corrected: { [ key: string ]: any } = {};
    // parse dotted paths into schema path style
    for (const path in query) {
        const translated = dottedToSchemaPath(path, resource.name);
        const fieldType = validator.schemas[translated]?.type as FieldType;

        const converter = CONVERTERS[fieldType];
        if (!converter) {
            if (unknownFieldPolicy === 'reject') {
                throw new BadRequestError(`
                Unable to filter on unknown field: ${path}.
                To filter on a field, it must be defined in the resources schema
                `);
            };
            corrected[path] = query[path];
            continue;
        }

        const converted = applyConverter(converter, query[path]);

        if (converted !== null && typeof converted === 'object') {
            // TODO: This means the value is an 'operator' like [in] or [gte]
            // so we need to make sure this operator makes sense for the type
            Object.keys(converted).forEach(op => checkOpForType(op, fieldType));
        }

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
        // TODO: This should respect unknown field policy
        throw new Error(`Unknown filter val type ${val}`);
    }
};

const CONVERTERS: { [ fieldType: string ]: (arg: any) => any } = {
    number: parseFloat,
    string: val => val.toString(),
    array: val => val
    // TODO: additional types (float, etc)
};

const TYPE_OP_MAP = {
    string: new Set(['gt', 'gte', 'lt', 'lte', 'like', 'contains', 'in']),
    number: new Set(['gt', 'gte', 'lt', 'lte', 'in']),
    array: new Set(['contains']),
    // TODO: additional types (float, etc)
}

const checkOpForType = (filter: string, fieldType: FieldType) => {
    if (!TYPE_OP_MAP[fieldType].has(filter)) {
        throw new BadRequestError(`Filter "${filter}" not applicable to field of type "${fieldType}`);
    }
}