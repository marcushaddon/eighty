import { OperationName } from '../types/operation';

export type HttpMethod = (
    'get' | 
    'post' |
    'put' |
    'patch' |
    'delete'
);

export const Operations: OperationName[] = [
    'list',
    'getOne',
    'create',
    'createOrUpdate',
    'replace',
    'update',
    'delete',
];

export const opMethods: { [ key in OperationName ]: HttpMethod } = {
    'list': 'get',
    'getOne': 'get',
    'create': 'post',
    'createOrUpdate': 'put',
    'replace': 'put',
    'update': 'patch',
    'delete': 'delete',
};