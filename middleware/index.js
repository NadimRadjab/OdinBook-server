const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");
const { userSchema } = require("../schemas");

module.exports.isPostAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id) && !req.user.isAdmin) {
      res.status(403).json({ success: false });
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
      res.status(403).json({ success: false });
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
      const user = await User.findById(userId).select(
        "-password -friendList -posts -comments -isAdmin -email"
      );
      res.json(user);
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
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
