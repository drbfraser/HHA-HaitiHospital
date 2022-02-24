export const HTTP_UNAUTHORIZED_CODE = 401;

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
        this.status = HTTP_UNAUTHORIZED_CODE;
        this.message = message;
    }
}
