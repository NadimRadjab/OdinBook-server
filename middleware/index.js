const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");
const Chat = require("../models/chat");
const Message = require("../models/message");
const {
  userSchema,
  postSchema,
  commentSchema,
  postSchemaImage,
} = require("../schemas");
const Like = require("../models/likes");

module.exports.isPostAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ success: false });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isCommentAuthor = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ success: false });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isFriend = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!req.user.friendList.includes(userId)) {
      const user = await User.findById(userId)
        .select("friendInvites fullName gender image friendList")
        .populate({ path: "friendList", select: "fullName image" });
      const posts = [];
      res.json({ user, posts });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.isInFriendInvites = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.friendId).select(
      "friendInvites"
    );

    const friends = user.friendInvites.map((user) => user._id);
    if (friends.includes(req.user._id.toString())) {
      return res.status(400).json({ message: "Invite already sent" });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isInFriendList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("friendList");
    const friends = user.friendList.map((friend) => friend._id.toString());
    if (friends.includes(req.params.friendId)) {
      return res.status(400).json({ message: "Already a friend" });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isLiked = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({ msg: "Post not found" });
    const likes = await Like.find({ author: req.user._id });

    for (let like of likes) {
      if (post.likes.includes(like._id)) {
        await Post.findByIdAndUpdate(req.params.id, {
          $pull: {
            likes: like._id,
          },
        });
        await Like.findByIdAndDelete(like._id);
        return res.json(like._id);
      }
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isChat = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const chat = await Chat.find({
      participants: { $all: [req.user._id, user._id] },
    });
    if (!chat.length) {
      const newChat = new Chat();
      newChat.participants.push(req.user._id, userId);
      await newChat.save();

      const findChat = await Chat.findById(newChat._id).populate({
        path: "participants",
        select: "fullName image",
      });

      return res.json([findChat]);
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
module.exports.validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
module.exports.validatePostImage = (req, res, next) => {
  const { error } = postSchemaImage.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
