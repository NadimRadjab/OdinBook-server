const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../models/users");
const bycrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      User.findOne({ email }, (err, user) => {
        console.log(user);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }
        bycrypt.compare(password, user.password, (err, res) => {
          console.log(password, user.password);
          console.log(res);
          if (err) throw err;
          if (res) {
            console.log(res);
            return done(null, user, { message: "Logged In Successfully!" });
          } else {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
        });
      });
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.user._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
