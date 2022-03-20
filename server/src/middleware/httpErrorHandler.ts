import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../exceptions/httpException';

const httpErrorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
  
  const isHttpError = error instanceof HttpError;
  const status = isHttpError ? error.status : 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({
    message
  });
};

export default httpErrorMiddleware;
