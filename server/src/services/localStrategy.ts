import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import Joi from 'joi';
import { Request } from 'express';

import User from '../models/User';
import { loginSchema } from './validators';

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
  },
  async (req: Request, username: string, password: string, done) => {
    loginSchema
      .validateAsync({ username, password })
      .then((val) => {
        req.body = val;
      })
      .catch((err) => {
        throw new Error('Failed to validate input ' + err.details[0].message);
      });

    try {
      const user = await User.findOne({ username: username.trim() });
      if (!user) {
        return done(null, false, { message: 'Username does not exists.' });
      }
      user.comparePassword(password, function (err: any, isMatch: boolean) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
);

// Serializing required for sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(passportLogin);
