import { OperationName } from "../types/operation";
import { Resource } from "../types/resource";
export declare const getRoute: (op: OperationName, resource: Resource) => {
    expressRoute: string;
    openApiRoute: string;
    openApiParams: {
        in: string;
        name: string;
        descriptionTemplate: string;
    }[];
};
export declare const friendlyOpNames: {
    getOne: string;
    list: string;
    create: string;
    replace: string;
    update: string;
    delete: string;
};
export declare const printAllPaths: (obj: any) => string[][];
