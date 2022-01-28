import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/User';
import { expression } from 'joi';

// JWT strategy
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  }
);

passport.use(jwtLogin);
