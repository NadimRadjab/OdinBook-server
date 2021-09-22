const Post = require("../models/posts");
const User = require("../models/users");
const { cloudinary } = require("../cloudinary");

module.exports.getPosts = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).select("friendList");
  const ids = [];
  ids.push(id);
  ids.push(...user.friendList);
  const userPost = await Post.find({ author: ids })
    .populate({
      path: "author",
      select: "firstName lastName fullName image",
    })
    .populate({
      path: "likes",
      select: "author",
    });

  res.json(userPost);
};
module.exports.createPost = async (req, res, next) => {
  const { text } = req.body;
  const post = new Post({ text });
  const user = await User.findById(req.user._id);
  post.author = user._id;
  user.posts.push(post);
  const newPost = await post.save();
  await newPost.populate({
    path: "author",
    select: "firstName lastName fullName image",
  });
  await user.save();
  res.json(newPost);
};
module.exports.createPostWithImage = async (req, res, next) => {
  console.log(req.file);

  const { path, filename } = req.file;
  const newPath = path.replace("/upload", "/upload/w_500");
  const post = new Post();
  const user = await User.findById(req.user._id);
  post.author = user._id;
  post.image.push({ url: newPath, fileName: filename });
  user.posts.push(post);
  const newPost = await post.save();
  await newPost.populate({
    path: "author",
    select: "firstName lastName fullName image",
  });
  await user.save();
  res.json(newPost);
};
module.exports.uploadImage = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) res.json({ msg: "Post does not exist!" });
  post.image.push(req.file);
  res.json({ succsess: true });
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
  if (!post.image.length) res.json({ succsess: true });
  else {
    res.json({ succsess: true });
    await cloudinary.uploader.destroy(fileName);
  }
};
