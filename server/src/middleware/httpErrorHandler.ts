import { InvalidInput, SystemException } from 'exceptions/systemException';
import { NextFunction, Request, Response } from 'express';
import { BadRequest, HttpError, InternalError } from '../exceptions/httpException';

const httpErrorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {

  let isHttpError = (error as HttpError) instanceof HttpError;
  if (!isHttpError) {
    if (error instanceof InvalidInput) {
      error = new BadRequest(error.message);
      isHttpError = true;
    } else {
        error = new InternalError(error.message || "Something went wrong");
    }
  }

  let status = (error as HttpError).status;
  const message = error.message;
  response.status(status).send({
    message
  });
};

export default httpErrorMiddleware;
