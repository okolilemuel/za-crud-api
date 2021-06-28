export class RequestValidationError extends Error {
    constructor(message:string) {
        super();
        this.name = 'RequestValidationError';
        this.message = message;
        Error.captureStackTrace(this, RequestValidationError);
    }
}

export class ItemNotFoundError extends Error {
    constructor(message:string) {
        super();
        this.name = 'ItemNotFoundError';
        this.message = message;
        Error.captureStackTrace(this, ItemNotFoundError);
    }
}
