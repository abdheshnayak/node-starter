import { readSecret } from "./read-secret";

const JwtStrategy = require("passport-jwt").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = readSecret("SECRET_KEY");

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log("Here: ", jwt_payload, done);
      return done(null, jwt_payload);
    })
  );
};
