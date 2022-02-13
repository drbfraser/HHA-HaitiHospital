import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../exceptions/httpException';

const httpErrorMiddleware = (error: HttpError, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status)
        .send({
            status,
            message,
        })
}

export default httpErrorMiddleware;