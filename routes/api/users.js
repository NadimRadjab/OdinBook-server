const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");

const { isFriend } = require("../../middleware");
const {
  getUserProfile,
  getMainUser,
  searchUsersProfile,
} = require("../../controllers/users");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getMainUser)
);
router.get(
  "/s",
  passport.authenticate("jwt", { session: false }),
  catchAsync(searchUsersProfile)
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(getUserProfile)
);

module.exports = router;
