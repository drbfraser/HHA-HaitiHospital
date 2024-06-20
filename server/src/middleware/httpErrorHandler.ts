import { CustomError } from 'exceptions/custom_exception';
import { InvalidInput } from 'exceptions/systemException';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { BadRequest, HttpError, InternalError } from '../exceptions/httpException';

const httpErrorMiddleware = (
  error: Error | CustomError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let httpError: HttpError;
  if (error instanceof HttpError) {
    httpError = error;
  } else if (error instanceof InvalidInput) {
    httpError = new BadRequest(error.message);
  } else {
    httpError = new InternalError(error.message || 'Something went wrong');
  }
  logger.error(
    `message: ${httpError.message}, status: ${httpError.status} method: ${request.method}, path: ${request.path}`,
  );
  response.status(httpError.status).send(httpError.message);
};

export default httpErrorMiddleware;
