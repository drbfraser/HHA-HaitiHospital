import { InvalidInput } from 'exceptions/systemException';
import { NextFunction, Request, Response } from 'express';
import { BadRequest, HttpError } from '../exceptions/httpException';

const httpErrorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
  
  let isHttpError = error instanceof HttpError;

  if (!isHttpError) {
    if (error instanceof InvalidInput) {
      error = new BadRequest(error.message);
      isHttpError = true;
    }
  }

  const status = isHttpError ? error.status : 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({
    message
  });
};

export default httpErrorMiddleware;
