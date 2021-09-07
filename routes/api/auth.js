const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { firstName, lastName, gender, email, password } = req.body;

  if (!firstName || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  }
  const user = new User(req.body);
  const newUser = await user.save();
  jwt.sign({ id: newUser.id }, "secret", { expiresIn: 3600 }, (err, token) => {
    if (err) throw err;
    res.send({
      token: "Bearer " + token,
      newUser,
    });
  });
});
module.exports = router;
