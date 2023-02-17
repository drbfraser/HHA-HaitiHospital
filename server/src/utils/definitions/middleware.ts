import { RequestWithUser } from 'utils/definitions/express';
import { Response, NextFunction } from 'express';

export type Middleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;
