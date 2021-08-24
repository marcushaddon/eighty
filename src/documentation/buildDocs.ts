import { OpenAPI, OpenAPIV3 } from "openapi-types";
import { parse } from "yaml";
import { Schema } from "jsonschema";
import { opMethods } from "../const/operations";
import { Operation, OperationName } from "../types/operation";
import { Resource } from "../types/resource";
import { EightySchema } from "../types/schema";
import { getRoute, friendlyOpNames, printAllPaths } from "../util";
import { loadSchema } from "../buildResourceSchemas";
import { JsonSchemaGenerator } from "typescript-json-schema";
import path from "path/posix";

export const buildDocs = (schema: EightySchema): OpenAPIV3.Document => {
    const baseDoc: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: {
            title: schema.name || 'CRUD API',
            version: '1.2.3'
        },
        paths: buildPaths(schema.resources)
    };

    return baseDoc as OpenAPIV3.Document;
};

const buildPaths = (resources: Resource[]): OpenAPIV3.PathsObject => {
    const paths = resources.map(resource => {
        if (!resource.operations) return [];

        return Object.entries(resource.operations)
            .map(([ op, config ]) => buildPath(
                op as OperationName,
                config!,
                resource
            ));
    }).reduce(( acc, current ) => [ ...acc, ...current], []);

    const pathsObj: OpenAPIV3.PathsObject = {};

    for (const path of paths) {
        const { description, responses, parameters } = path;
        const methodObj = {
            description,
            responses,
            parameters,
        };

        if (!pathsObj[path.route]) {
            pathsObj[path.route] = {
                [path.method]: methodObj
            }
        } else {
            pathsObj[path.route]![path.method] = methodObj;
        }
    };

    return pathsObj;
};

const buildPath = (
    op: OperationName,
    opConfig: Operation,
    resource: Resource
) => {
    const { openApiRoute, openApiParams } = getRoute(op, resource);

    const queryParamTemplates = op === 'list' ? buildListParams(resource) : [];
    const queryParams = queryParamTemplates.map( template => ({
        in: template.in,
        name: template.name,
        description: fmt(template.descriptionTemplate, op, resource, { field: template.name }),
        example: fmt(template.exampleTemplate, op, resource, { field: template.name }),
    }))

    const { descriptionTemplate, successStatus } = opMap[op];
    const method = opMethods[op];
    const description = fmt(descriptionTemplate, op, resource);

    const authDescriptionTemplate = buildAuthDescriptionTemplate(opConfig);
    const authDescription = fmt(authDescriptionTemplate, op, resource);
    const successContent = successStatus.getContent(resource);
    const successDescription = fmt(successStatus.descriptionTemplate, op, resource);

    const stati: OpenAPIV3.ResponsesObject = {
        [successStatus.status]: {
            description: successDescription,
            content: {
                'application/json': { schema: successContent as OpenAPIV3.ResponseObject },
            },
        }
    };

    for (const error of errors) {
        stati[error.status] = {
            description: fmt(error.descriptionTemplate, op, resource)
        };
    };

    const parameters = openApiParams.map(p => {
        return {
            ...p,
            description: fmt(
                p.descriptionTemplate,
                op,
                resource
            )
        };

    });

    const allParams = [ ...parameters, ...queryParams ];

    return {
        method,
        route: openApiRoute,
        parameters: allParams,
        description: description + authDescription,
        responses: stati,
    }
};

const buildAuthDescriptionTemplate = (op: Operation): string => {
    let template = ' ';
    if (op.authentication || op.authorization) {
        template += 'Authentication required.'
    }

    if (op.authorization) {
        const { allOf, anyOf } = op.authorization;
        const requirements = (allOf || anyOf)!
            .map((config): string => {
                switch (config.type) {
                    case 'hasRole':
                        return `have the role '${config.role}'`;
                    case 'inGroup':
                        return `belong to user group '${config.group}'`;
                    case 'isResource':
                        return 'be the <resource> in question';
                    case 'isOwner':
                        return 'be the owner of the <resource>';
                    default:
                        throw new Error(`Unknown authorization type: ${(config as any).type}`);
                }
            });

        if (requirements.length === 1) {
            template += ` Additionally, the user making the request must ${requirements[0]}.`
        } else {
            const level = allOf ? 'all' : 'at least one';
            const condition = allOf ? 'and' : 'or';

            template += ` Additionally, the user making the request must meet ${level} of the following requirements: `;
            template += requirements
                .slice(0, requirements.length - 1)
                .join(', ');
            template += `, ${condition} ${requirements[requirements.length - 1]}.`;
        }
    }

    return template;
}

const maybeGetSchema = (resource: Resource) => {
    return resource.schemaPath && loadSchema(resource) || {};
};

const getPaginatedVersion = (schema: Schema): Schema => ({
    type: 'object',
    properties: {
        total: {
            type: 'number',
        },
        results: {
            type: 'array',
            items: schema,
        }
    },
    required: [ 'total', 'results' ]
});

const buildPatchOpSchema = (): Schema => {

    return {
        type: "array",
        items: {
            type: "object",
            properties: {
                op: { 
                    type: "string",
                    enum: [ "add", "remove", "replace", "copy" ],
                 },
                path: { type: "string" }, // TODO: maybe we just put all the examples in here?
                from: { type: "string" },
                value: { type: "any" },
            },
            required: [ "op", "path" ]
        }

    };
};

// TODO: This is where its broken
const buildListParams = (resource: Resource): {
    in: string,
    name: string,
    descriptionTemplate: string,
    exampleTemplate: string,
}[] => {
    const irrelevant = new Set([ 'required', 'object', 'properties', 'type', '$schema', '' ]);
    // TODO: Figure out valid filter params based on resource
    if (!resource.schemaPath) return [];
    const schema = loadSchema(resource);

    const paths = printAllPaths(schema);
    const relevantPaths = paths
        .filter(path => (
            path.indexOf('required') === -1 &&
            path[path.length-1] !== 'object' &&
            path[0] !== '$schema'
        ));

    const params = relevantPaths
        .map(path => path
                .map(part => part === 'items' && '[i]' || part)
                .filter(part => !irrelevant.has(part))
                .slice(0, -1)
                .join('.'));
    const types = relevantPaths.map(p => p[p.length - 1]);
    
    const filters = params
        .map((param, i) => {
            const typeForParam = types[i];
            const ops = queryTypeOperatorsTemplates[typeForParam];
            return ops.map(({ descTemplate, exampleTemplate, op }) => ({ 
                in: 'query',
                name: param + (op === '=' ? '' : `[${op}]`),
                descriptionTemplate: descTemplate,
                exampleTemplate: exampleTemplate,
            }))
        }).reduce((acc, curr) => [ ...acc, ...curr], []);
    
    return filters;
}

const equalQueryParam = (t: string) => ({
    op: '=',
    descTemplate: 'filters for records where <field> equals given value',
    exampleTemplate: `?<field>=${t === 'string' && 'foo' || t === 'number' && '7' || t === 'boolean' && 'true' || 'TODO'}`
});

const queryTypeOperatorsTemplates: { [ _: string ]: { op: string, descTemplate: string, exampleTemplate: string }[] } = {
    number: [equalQueryParam('number'), {
        op: '[in]',
        descTemplate: 'filters for records where <field> in values',
        exampleTemplate: '?<field>[in]=3&<field>[in]=5',
    }, ...[['gt', 'greater than'], ['lt', 'less than'], ['gte', 'greater than or equal to'], ['lte', 'less than or equal to']].map(([op, desc]) => ({
        op: `[${op}]`,
        descTemplate: `filters for records where <field> ${desc} given value`,
        exampleTemplate: `?<field>=10`
    }))],
    string: [equalQueryParam('string'), {
        op: '[in]',
        descTemplate: 'filters for records where <field> in values',
        exampleTemplate: '?<field>[in]=3&<field>[in]=5',
    }, ...[['gt', 'comes after'], ['lt', 'comes before'], ['gte', 'comes after or the same as'], ['lte', 'comes before or the same as']].map(([op, desc]) => ({
        op: `[${op}]`,
        descTemplate: `filters for records where <field> ${desc} given value`,
        exampleTemplate: `?<field>=aab`
    })), {
        op: '[likeTODO]', // TODO?
        descTemplate: 'filters for records where <field> matches given pattern',
        exampleTemplate: '?<field>=t*do'
    }],
    array: [{
        op: '[containsTODO]',
        descTemplate: 'filters for records where <field> contains given value',
        exampleTemplate: '?<field>=foo'
    }],
    boolean: [equalQueryParam('boolean')],
};

const opMap = {
    getOne: {
        descriptionTemplate: `Fetches one <resource>.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully fetched a <resource>.`,
                getContent: maybeGetSchema
            },
    },
    list: {
        descriptionTemplate: `Lists <resource>s.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully listed <resource>s.`,
                getContent: (resource: Resource) => getPaginatedVersion(maybeGetSchema(resource)),
            }
    },
    create: {
        descriptionTemplate: `Creates a new <resource>.`,
        successStatus: {
                status: 201,
                descriptionTemplate: `Successfully created a <resource>.`,
                getContent: maybeGetSchema,
            }
    },
    replace: {
        descriptionTemplate: `Replaces one <resource>.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully replaced <resource>.`,
                getContent: maybeGetSchema,
            }
    },
    update: {
        descriptionTemplate: `Makes JSON Patch update to one <resource>.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully updated <resource>.`,
                getContent: (resource: Resource) => buildPatchOpSchema(),
            }
    },
    delete: {
        descriptionTemplate: `Deletes one <resource>.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully fetched a <resource>.`,
                getContent: (resource: Resource) => undefined,
            }
    },
};

const errors = [
    {
        status: 404,
        descriptionTemplate: `Unable to find <resource>.`,
    },
    {
        status: 401,
        descriptionTemplate: `Unauthenticated users are not allowed to <op> <resource>s.`
    },
    {
        status: 403,
        descriptionTemplate: `User is not authorized to <op> this <resource>.`
    },
    {
        status: 500,
        descriptionTemplate: `We encountered an internal error.`
    }
];

const fmt = (
    template: string,
    op: OperationName,
    resource: Resource,
    dict?: { [ from: string ]: string },
): string => {

    let opsAndNames = template
        .replace(/<resource>/g, resource.name)
        .replace(/<op>/g, friendlyOpNames[op]);

    if (!dict) return opsAndNames;

    Object.entries(dict)
        .forEach(([ from, to ])  => {
            const exp = new RegExp(`<${from}>`, 'g');
            opsAndNames = opsAndNames
                .replace(exp, to);
        });
    return opsAndNames;
}

