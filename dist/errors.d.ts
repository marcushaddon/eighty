export declare class NotFoundError extends Error {
    status: number;
    message: string;
    constructor(message?: string);
}
export declare class BadRequestError extends Error {
    status: number;
    message: string;
    constructor(message?: string);
}
export declare class AuthorizationError extends Error {
    status: number;
    message: string;
    constructor(message?: string);
}
