import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getUserById } from '../models/users';
import { keys } from '../config/keys';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

export const strategyPassport =  passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    await getUserById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => {
        done(err, false)
      });
  })
);