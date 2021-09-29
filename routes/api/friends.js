const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isInFriendInvites, isInFriendList } = require("../../middleware");

const {
  addFriend,
  deleteFriend,
  sendFriendInvetation,
  removeFriendInvetation,
  cancelFriendInvetation,
} = require("../../controllers/friends");

//Accept and delete Friend
router
  .route("/:friendId")
  .put(
    passport.authenticate("jwt", { session: false }),
    isInFriendList,
    catchAsync(addFriend)
  )
  .delete(
    passport.authenticate("jwt", { session: false }),

    catchAsync(deleteFriend)
  );
//Send and cancel invites
router
  .route("/:friendId/invite")
  .post(
    passport.authenticate("jwt", { session: false }),
    isInFriendInvites,
    isInFriendList,
    catchAsync(sendFriendInvetation)
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    catchAsync(cancelFriendInvetation)
  );

//Remove invites
router.delete(
  "/:friendId/remove",
  passport.authenticate("jwt", { session: false }),
  catchAsync(removeFriendInvetation)
);

module.exports = router;
