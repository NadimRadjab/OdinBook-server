const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users");
const bycrypt = require("bcryptjs");

passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    email,
    password,
    done
  ) {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "Incorrect email or password.",
        });
      }
      bycrypt.compare(password, user.password, (err, res) => {
        if (err) throw err;
        if (res) {
          return done(null, user, { message: "Logged In Successfully!" });
        } else {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }
      });
    });
  })
);

module.exports = passport;
