export const HTTP_UNAUTHORIZED_CODE = 401;
export const HTTP_BADREQUEST_CODE = 400;
export const HTTP_UNPROCESSABLE_ENTITY_CODE = 422;

export const HTTP_INTERNALERROR_CODE = 500;


export class HttpError extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(HTTP_UNAUTHORIZED_CODE, message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(HTTP_BADREQUEST_CODE, message);
    }
}

export class InternalError extends HttpError {
    constructor(message: string) {
        super(HTTP_INTERNALERROR_CODE, message);
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(message: string) {
        super(HTTP_UNPROCESSABLE_ENTITY_CODE, message);
    }
}
