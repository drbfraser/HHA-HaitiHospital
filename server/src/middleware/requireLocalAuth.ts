import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { UserJson } from 'models/user';
import { HTTP_UNPROCESSABLE_ENTITY_CODE } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
// import * as passport from 'passport';

// const somePassport : passport = passport;

const requireLocalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user: UserJson, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.error('Cannot authenticate request, user does not exist.');
      return res.status(HTTP_UNPROCESSABLE_ENTITY_CODE).send(info);
    }
    (req as RequestWithUser).user = user;
    next();
  })(req, res, next);
};

export default requireLocalAuth;
