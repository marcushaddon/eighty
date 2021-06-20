import { OperationName } from '../types/operation';

export type HttpMethod = (
    'GET' | 
    'POST' |
    'PUT' |
    'PATCH' |
    'DELETE'
);

export const Operations: OperationName[] = [
    'get',
    'getOne',
    'create',
    'createOrUpdate',
    'replace',
    'update',
    'delete',
];

export const opMethods: { [ key in OperationName ]: HttpMethod } = {
    'get': 'GET',
    'getOne': 'GET',
    'create': 'POST',
    'createOrUpdate': 'PUT',
    'replace': 'PUT',
    'update': 'PATCH',
    'delete': 'DELETE',
};