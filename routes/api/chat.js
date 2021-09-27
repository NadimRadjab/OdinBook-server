const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isChat } = require("../../middleware");
const {
  makeMessage,
  getChat,
  getMessages,
  deleteUnreadMessages,
} = require("../../controllers/chat");

//Makes a new message
router.post(
  "/messages",
  passport.authenticate("jwt", { session: false }),
  catchAsync(makeMessage)
);
//Get chat
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isChat,
  catchAsync(getChat)
);

//Get messages for the chat
router.get(
  "/:chatId/messages",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getMessages)
);
//Delete unread messages for the current user
router.put(
  "/:chatId/messages",
  passport.authenticate("jwt", { session: false }),
  catchAsync(deleteUnreadMessages)
);

module.exports = router;
