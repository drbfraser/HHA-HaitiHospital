import passport from 'passport';
import { Request, Response, NextFunction } from "express";
// import * as passport from 'passport';

// const somePassport : passport = passport;

const requireLocalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    // console.log(user);
    // console.log(req);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(422).send(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default requireLocalAuth;
