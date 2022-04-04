import { CustomError } from "./custom_exception";

export const HTTP_OK_CODE = 200;
export const HTTP_CREATED_CODE = 201;
export const HTTP_NOCONTENT_CODE = 204;
export const HTTP_UNAUTHORIZED_CODE = 401;
export const HTTP_BADREQUEST_CODE = 400;
export const HTTP_NOTFOUND_CODE = 404;
export const HTTP_CONFLICT_CODE = 409;
export const HTTP_UNPROCESSABLE_ENTITY_CODE = 422;
export const HTTP_INTERNALERROR_CODE = 500;

export class HttpError extends CustomError {
  status: number;
  constructor(status: number, message: string) {
    super(new Error(message));
    this.status = status;
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string) {
    super(HTTP_UNAUTHORIZED_CODE, message);
  }
}

export class BadRequest extends HttpError {
  constructor(message: string) {
    super(HTTP_BADREQUEST_CODE, message);
  }
}

export class InternalError extends HttpError {
  constructor(message: string) {
    super(HTTP_INTERNALERROR_CODE, message);
  }
}

export class UnprocessableEntity extends HttpError {
  constructor(message: string) {
    super(HTTP_UNPROCESSABLE_ENTITY_CODE, message);
  }
}

export class NotFound extends HttpError {
    constructor(message: string) {
        super(HTTP_NOTFOUND_CODE, message);
    }
}

export class Conflict extends HttpError {
    constructor(message: string) {
        super(HTTP_CONFLICT_CODE, message);
    }
}