const Post = require("../models/posts");
const Comment = require("../models/comments");

module.exports.isPostAuthor = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
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
