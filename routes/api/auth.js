const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/register", async (req, res) => {
  const { firstName, lastName, gender, email, password } = req.body;

  if (!firstName || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  }
  const user = new User(req.body);
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, async (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      const newUser = await user.save();
      jwt.sign(
        { id: newUser.id },
        "secret",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: "Bearer " + token,
            newUser,
          });
        }
      );
    });
  });
});

router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        info,
        user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) throw err;
    });
    const token = jwt.sign({ user }, "secret", { expiresIn: 3600 });
    return res.json({ user, token: `Bearer ${token}` });
  })(req, res);
});
module.exports = router;
