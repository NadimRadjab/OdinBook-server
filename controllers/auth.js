const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

module.exports.getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("fullName");

  res.json(user);
};

module.exports.registerUser = async (req, res, next) => {
  let isUser = await User.findOne({ email: req.body.email });

  if (isUser) {
    res.status(400).json({ message: "User already exists" });
  }
  const user = new User(req.body);
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, async (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      user.fullName = `${req.body.firstName} ${req.body.lastName}`;

      user.default;
      const newUser = await user.save();
      jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 * 7 },
        (err, token) => {
          if (err) throw err;
          newUser.password = "";

          res.json({
            user: {
              ...newUser._doc,
            },
            token: "Bearer " + token,
          });
        }
      );
    });
  });
};
module.exports.logInUser = (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    user.password = "";
    if (err || !user) {
      return res.status(400).json({
        info,
        user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) throw err;
    });
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 24 * 7,
    });
    return res.json({ user, token: `Bearer ${token}` });
  })(req, res);
};
