export class NotFoundError extends Error {
    status = 404;
    message = 'Not found';
    constructor(message = 'Not found') {
        super();
        this.message = message;
    }
}