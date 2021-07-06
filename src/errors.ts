export class NotFoundError extends Error {
    status = 404;
    message = 'Not found';
    constructor(message = 'Not found') {
        super();
        this.message = message;
    }
}

export class BadRequestError extends Error {
    status = 400;
    message = 'Bad request';
    constructor(message = 'Bad request') {
        super();
        this.message = message;
    }
}

export class AuthorizationError extends Error {
    status = 403;
    message = 'Forbidden';

    constructor(message = 'Forbidden') {
        super();
        this.message = message;
    }
}