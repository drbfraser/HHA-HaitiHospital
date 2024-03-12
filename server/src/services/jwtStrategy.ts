import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import * as ENV from '../utils/processEnv';
import User from '../models/user';

// JWT strategy
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: (req: { cookies: { jwt: any } }) => req.cookies.jwt,
    secretOrKey: ENV.JWT_SECRET,
  },
  async (payload: { id: any }, done) => {
    try {
      const user = await User.findById(payload.id).lean();

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  },
);

passport.use(jwtLogin);
