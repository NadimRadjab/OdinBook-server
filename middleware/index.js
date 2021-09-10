const Post = require("../models/posts");
const Comment = require("../models/comments");

module.exports.isAuthor = async (req, res, next) => {
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
