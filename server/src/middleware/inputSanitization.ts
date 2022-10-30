import { HTTP_UNPROCESSABLE_ENTITY_CODE } from 'exceptions/httpException';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const inputErrors = validationResult(req);
  if (!inputErrors.isEmpty()) {
    return res.status(HTTP_UNPROCESSABLE_ENTITY_CODE).send({ errors: inputErrors.array() });
  }
  next();
};
