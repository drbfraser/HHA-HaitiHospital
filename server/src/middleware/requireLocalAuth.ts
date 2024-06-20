import { NextFunction, Request, Response } from 'express';

import { HTTP_UNAUTHORIZED_CODE } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
import { User } from '@hha/common';
import { logger } from 'logger';
import passport from 'passport';

const requireLocalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: User, info: string) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      logger.error({
        message: `Failed login attempt, user-password pair does not exist.`,
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        requestBody: req.body,
      });
      return res.status(HTTP_UNAUTHORIZED_CODE).send(info);
    }
    (req as RequestWithUser).user = user;
    next();
  })(req, res, next);
};

export default requireLocalAuth;
