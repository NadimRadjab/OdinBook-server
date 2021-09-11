const Post = require("../models/posts");
const User = require("../models/users");

module.exports.createPost = async (req, res, next) => {
  const { text } = req.body;
  const post = new Post({ text });
  const user = await User.findById(req.user._id);
  post.author = user._id;
  user.posts.push(post);
  const newPost = await post.save();
  await user.save();
  res.json(newPost);
};
module.exports.editPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, { ...req.body });
  if (!post) res.json({ msg: "Post does not exist!" });
  res.json({ succsess: true });
};
module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  res.json({ succsess: true });
};
