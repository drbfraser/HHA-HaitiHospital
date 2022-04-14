import { CustomError } from 'exceptions/custom_exception';
import { InvalidInput } from 'exceptions/system_exception';
import { NextFunction, Request, Response } from 'express';
import { BadRequest, HttpError, InternalError } from '../exceptions/http_exception';

const responseByError = (error: Error | CustomError, request: Request, response: Response, next: NextFunction) => {
  let httpError: HttpError;
  if (error instanceof HttpError) {
    httpError = error;
  } else 
  {
    if (error instanceof InvalidInput) {
        httpError = new BadRequest(error.message);
    }
    else {
        httpError = new InternalError(error.message || "Something went wrong");
    }
  }
  response.status(httpError.status).send(httpError.toJson());
};

export default responseByError;
