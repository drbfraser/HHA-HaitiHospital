import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { Request } from 'express';
import { validationResult } from 'express-validator';

import UserCollection, { User } from '../models/user';

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req: Request, username: string, password: string, done) => {
    // TODO: validate with express-validator - #93 Done
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new Error('Failed to validate input: ' + errorMessages.join(' '));
    }

    try {
      const user = await UserCollection.findOne({ username: username.trim() });
      if (!user) {
        return done(null, false, { message: 'Username does not exists.' });
      }
      user!.comparePassword(password, async function (err: any, isMatch: boolean) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        const leanUser = await UserCollection.findOne({ username: username.trim() }).lean();
        return done(null, leanUser!);
      });
    } catch (err) {
      return done(err);
    }
  },
);

// Serializing required for sessions
passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.use(passportLogin);
