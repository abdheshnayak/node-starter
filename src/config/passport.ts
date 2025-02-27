import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { getEnv } from "./load-env";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getEnv().SECRET_KEY
};

export const useJwt = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      return done(null, jwt_payload);
    })
  );
};
