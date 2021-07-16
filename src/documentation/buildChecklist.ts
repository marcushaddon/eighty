import { Resource } from "../types/resource";
import { EightySchema } from "../types/schema";

export const buildChecklist = (schema: EightySchema): string[] => {
    // Database connection string
    const dbItems = dbChecklist(schema);
    const resourceItems = resourceChecklist(schema);

    return [
        ...dbItems,
        ...resourceItems,
    ]
};

const dbChecklist = (schema: EightySchema): string[] => {
    let dbType: string;
    let dbConnVar: string;
    switch (schema.database.type) {
        case 'mongodb':
            dbType = 'MongoDB';
            dbConnVar = 'MONGO_URL';
            break;
        case 'postgres' as 'mongodb':
            dbType = 'Postgres SQL';
            dbConnVar = 'POSTGRES_URL';
            break;
        default:
            throw new Error(`Unsupported db type: ${schema.database.type}`);
    }

    return [
        `A connection string is set to env var: $${dbConnVar}`,
        `A healthy ${dbType} instance is running at address indicated by $${dbConnVar}`
    ]

};

const resourceChecklist = (schema: EightySchema): string[] => {
    const collection = schema.database.type === 'mongodb' ? 'collection' : 'table';
    let list: string[] = [];

    for (const resource of schema.resources) {
        list.push(`Database has a ${collection} with name "${resource.name}s"`);
        list = [ ...list, ...opsChecklist(schema, resource)];
    }

    return list;
};

const opsChecklist = (schema: EightySchema, resource: Resource): string[] => {
    if (!resource.operations) return [];
    let list: string[] = [];
    if (resource.operations.getOne && schema.database.type !== 'mongodb') {
        list.push(`Table "${resource.name}s" has unique "id" column for getOne operation`);
    }

    // TODO: gather auth checklist
    list.push('Authentication middleware in place that attaches "user" ' +
        'object to req on authenticated routes. "user" object has id field, ' +
        'and if user belongs to a group or has a role, "group" and "role" ' +
        'fields respectively.' )

    return list;
};

const schema: EightySchema = {
    name: 'Cool CRUD',
    version: '1.0.0',
    database: {
        type: 'postgres' as 'mongodb',
    },

    resources: [
        {
            name: 'bike',
            operations: {
                create: {
                    authentication: true,
                    authorization: {
                        allOf: [
                            { type: 'hasRole', role: 'bike-builder' }
                        ]
                    }
                },
                getOne: {}
            } as any
        }
    ]
};
