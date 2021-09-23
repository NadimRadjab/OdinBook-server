const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isChat } = require("../../middleware");
const Message = require("../../models/message");
const Chat = require("../../models/chat");
// const User = require("../../models/user");

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isChat,
  async (req, res) => {
    // const sender = User.findById(req.user._id);
    // const reciver = User.findById(req.params.id);
    const message = new Message(req.body);
    message.sender = req.user._id;
    const chat = new Chat();
    chat.messages.push(message);
    chat.participants.push(req.user._id, req.params.id);
    message.chat = chat;
    await message.save();
    await chat.save();
    res.json(chat);
  }
);
module.exports = router;
