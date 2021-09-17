const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comments");
const User = require("./users");
const Like = require("./likes");

const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

PostSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
    await Like.deleteMany({
      _id: {
        $in: doc.likes,
      },
    });
    await User.findByIdAndUpdate(doc.author.toString(), {
      $pull: {
        posts: doc._id.toString(),
      },
    });
  }
});
PostSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await User.findByIdAndUpdate(doc.author.toString(), {
      $elemMatch: {
        id: { text: doc.text },
      },
    });
  }
});

module.exports = mongoose.model("Post", PostSchema);
