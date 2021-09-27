const Message = require("../models/message");
const Chat = require("../models/chat");
const User = require("../models/users");

module.exports.makeMessage = async (req, res) => {
  const { chatId, userId, message } = req.body;
  const reciver = await User.findById(userId);
  const newMessage = new Message({ message });
  newMessage.sender = req.user._id;
  newMessage.chatId = chatId;
  reciver.unreadMessages.push(newMessage._id);
  await newMessage.save();
  await reciver.save();
  res.status(200).json(newMessage);
};

module.exports.getChat = async (req, res) => {
  const { userId } = req.params;

  const chat = await Chat.find({
    participants: { $all: [req.user._id, userId] },
  }).populate({ path: "participants", select: "fullName image" });

  res.status(200).json(chat);
};
module.exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({
    chatId: { $eq: chatId },
  })
    .limit(25)
    .sort({ createdAt: -1 });
  res.status(200).json(messages);
};

module.exports.deleteUnreadMessages = async (req, res) => {
  const { messages } = req.body;
  if (messages.includes("-")) return;
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { unreadMessages: messages },
  });

  res.status(200).json({ seccess: true });
};
