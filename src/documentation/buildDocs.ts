import { OpenAPI, OpenAPIV3 } from "openapi-types";
import { parse } from "yaml";
import { opMethods } from "../const/operations";
import { Operation, OperationName } from "../types/operation";
import { Resource } from "../types/resource";
import { EightySchema } from "../types/schema";
import { getRoute, friendlyOpNames } from "../util";
import { readFile } from "../eighty";
import { Schema } from "jsonschema";

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
                'application/json': { schema: successContent },
            },
        }
    };

    for (const error of errors) {
        stati[error.status] = {
            description: fmt(error.descriptionTemplate, op, resource)
        };
    };

    const parameters = openApiParams.map(p => ({
        ...p,
        description: fmt(
            p.descriptionTemplate,
            op,
            resource
        )
    }));

    return {
        method,
        route: openApiRoute,
        parameters,
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
                        return 'be the $resource$ in question';
                    case 'isOwner':
                        return 'be the owner of the $resource$';
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
    return resource.schemaPath && parse(readFile(resource.schemaPath));
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

const opMap = {
    getOne: {
        descriptionTemplate: `Fetches one $resource$.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully fetched a $resource$.`,
                getContent: maybeGetSchema
            },
    },
    list: {
        descriptionTemplate: `Lists $resource$s.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully listed $resource$s.`,
                getContent: (resource: Resource) => getPaginatedVersion(maybeGetSchema(resource)),
            }
    },
    create: {
        descriptionTemplate: `Creates a new $resource$.`,
        successStatus: {
                status: 201,
                descriptionTemplate: `Successfully created a $resource$.`,
                getContent: maybeGetSchema,
            }
    },
    replace: {
        descriptionTemplate: `Replaces one $resource$.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully replaced $resource$.`,
                getContent: maybeGetSchema,
            }
    },
    update: {
        descriptionTemplate: `Makes JSON Patch update to one $resource$.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully updated $resource$.`,
                getContent: maybeGetSchema,
            }
    },
    delete: {
        descriptionTemplate: `Deletes one $resource$.`,
        successStatus: {
                status: 200,
                descriptionTemplate: `Successfully fetched a $resource$.`,
                getContent: (resource: Resource) => undefined,
            }
    },
};

const errors = [
    {
        status: 404,
        descriptionTemplate: `Unable to find $resource$.`,
    },
    {
        status: 401,
        descriptionTemplate: `Unauthenticated users are not allowed to $op$ $resource$s.`
    },
    {
        status: 403,
        descriptionTemplate: `User is not authorized to $op$ this $resource$.`
    },
    {
        status: 500,
        descriptionTemplate: `We encountered an internal error.`
    }
];

const fmt = (
    template: string,
    op: OperationName,
    resource: Resource
): string => template
    .replace(/\$resource\$/g, resource.name)
    .replace(/\$op\$/g, friendlyOpNames[op]);

