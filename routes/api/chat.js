const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isChat } = require("../../middleware");
const Message = require("../../models/message");
const Chat = require("../../models/chat");
const User = require("../../models/users");

//Makes a new message
router.post(
  "/messages",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { chatId, userId, message } = req.body;
    const reciver = await User.findById(userId);
    const newMessage = new Message({ message });
    newMessage.sender = req.user._id;
    newMessage.chatId = chatId;
    reciver.unreadMessages.push(newMessage._id);
    await newMessage.save();
    await reciver.save();
    res.status(200).json(newMessage);
  }
);
//Get chat
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isChat,
  catchAsync(async (req, res) => {
    const { userId } = req.params;

    const chat = await Chat.find({
      participants: { $all: [req.user._id, userId] },
    }).populate({ path: "participants", select: "fullName image" });

    res.status(200).json(chat);
  })
);

//Get messages for the chat
router.get(
  "/:chatId/messages",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({
      chatId: { $eq: chatId },
    });
    res.status(200).json(messages);
  }
);
//Delete unread messages for the current user
router.put(
  "/:chatId/messages",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { messages } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: { unreadMessages: messages },
    });

    res.status(200).json(messages);
  }
);

module.exports = router;
