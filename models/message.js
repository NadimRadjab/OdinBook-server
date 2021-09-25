const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    message: String,
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
