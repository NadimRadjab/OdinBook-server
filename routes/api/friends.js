const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");

const {
  getFriends,
  addFriend,
  deleteFriend,
} = require("../../controllers/friends");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getFriends)
);

router
  .route("/:friendId")
  .post(passport.authenticate("jwt", { session: false }), catchAsync(addFriend))
  .delete(
    passport.authenticate("jwt", { session: false }),
    catchAsync(deleteFriend)
  );

module.exports = router;
