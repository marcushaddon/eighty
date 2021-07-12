import { OperationName } from "../types/operation";
import { Resource } from "../types/resource";

export const getRoute = (op: OperationName, resource: Resource) => {
    if (op === 'list' || op === 'create') return {
        expressRoute: `/${resource.name}s`,
        openApiRoute: `/${resource.name}s`,
        openApiParams: [],
    };
    
    return {
        expressRoute: `/${resource.name}s/:id`,
        openApiRoute: `/${resource.name}s/{id}`,
        openApiParams: [
            {
                in: 'path',
                name: 'id',
                descriptionTemplate: 'The id of the $resource$ to be $op$ed',
            }
        ]
    };
};

export const friendlyOpNames = {
    getOne: 'fetch',
    list: 'list',
    create: 'create',
    replace: 'replace',
    update: 'update',
    delete: 'delete'
}