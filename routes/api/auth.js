const express = require("express");
const router = express.Router();
const { validateUser } = require("../../middleware");
const catchAsync = require("../../utils/catchAsync");
const passport = require("passport");
const { registerUser, logInUser, getUser } = require("../../controllers/auth");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getUser)
);
router.post("/register", validateUser, catchAsync(registerUser));

router.post("/login", logInUser);
module.exports = router;
