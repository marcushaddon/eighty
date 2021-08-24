import { OperationName } from '../types/operation';
export declare type HttpMethod = ('get' | 'post' | 'put' | 'patch' | 'delete');
export declare const Operations: OperationName[];
export declare const opMethods: {
    [key in OperationName]: HttpMethod;
};
