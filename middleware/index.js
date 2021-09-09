const Post = require("../models/posts");
const Comment = require("../models/comments");

module.exports.isAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const post = await Post.findById(id);
  const comment = await Comment.findById(commentId);
  if (!post.author.equals(req.use._id)) {
    res.status(403).json({ success: false });
  }
  if (!comment.author.equals(req.use._id)) {
    res.status(403).json({ success: false });
  }
  next();
};
