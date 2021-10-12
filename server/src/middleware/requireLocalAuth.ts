// import passport from 'passport';
import * as passport from 'passport';

const requireLocalAuth = (req: any, res: any, next: any) => {
  passport.authenticate('local', (err, user, info) => {
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
