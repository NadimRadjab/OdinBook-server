const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isInFriendInvites } = require("../../middleware/");

const {
  getFriends,
  addFriend,
  deleteFriend,
  sendFriendInvetation,
  removeFriendInvetation,
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
router
  .route("/:friendId/invite")
  .post(
    passport.authenticate("jwt", { session: false }),
    isInFriendInvites,
    catchAsync(sendFriendInvetation)
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    catchAsync(removeFriendInvetation)
  );

module.exports = router;
