const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./users");

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

CommentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await User.findByIdAndUpdate(doc.author, {
      $pull: {
        comments: doc._id,
      },
    });
  }
});
CommentSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await User.findByIdAndUpdate(doc.author, {
      $elemMatch: {
        id: { text: doc.text },
      },
    });
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
