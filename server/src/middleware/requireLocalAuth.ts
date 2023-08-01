import { NextFunction, Request, Response } from 'express';

import { HTTP_UNAUTHORIZED_CODE } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
import { User } from 'models/user';
import { logger } from 'logger';
import passport from 'passport';

const requireLocalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user: User, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      logger.error('Cannot authenticate request, user does not exist.');
      return res.status(HTTP_UNAUTHORIZED_CODE).send(info);
    }
    (req as RequestWithUser).user = user;
    next();
  })(req, res, next);
};

export default requireLocalAuth;
