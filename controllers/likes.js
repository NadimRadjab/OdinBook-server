const Post = require("../models/posts");
const Like = require("../models/likes");

module.exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).json({ msg: "Post not found" });
  const like = new Like();
  post.likes.push(like);
  like.post = post._id;
  like.author = req.user._id;
  const newLike = await like.save();
  post.save();
  res.json(newLike);
};
