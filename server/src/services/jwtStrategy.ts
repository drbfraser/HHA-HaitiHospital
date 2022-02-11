import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as ENV from '../utils/processEnv';
import User from '../models/user.model';
import { expression } from 'joi';

// JWT strategy
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: ENV.JWT_SECRET
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
