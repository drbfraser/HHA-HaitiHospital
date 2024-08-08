import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const sanitizedBody: string = sanitizeRequestBody(req.body);
  logger.info(
    `Incoming Request - Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(sanitizedBody)}`,
  );
  next();
};

interface RequestBody {
  [key: string]: any;

  password?: string;
}

const sanitizeRequestBody = (body: RequestBody, maxLength: number = 1000): string => {
  const sanitizedBody: RequestBody = { ...body };

  // sanitize password
  if (sanitizedBody.password) {
    sanitizedBody.password = '***';
  }

  // Truncate the request body if its length exceeds maxLength to prevent logs from being overpopulated with excessively long request bodies.
  const bodyString = JSON.stringify(sanitizedBody);
  if (bodyString.length > maxLength) {
    return bodyString.substring(0, maxLength) + '... (truncated)';
  }

  return bodyString;
};
