const Post = require("../models/posts");
const User = require("../models/users");
const Comment = require("../models/comments");

module.exports.getComments = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).select("posts friendList");
  const ids = [];
  ids.push(id);
  ids.push(...user.friendList);
  const userPost = await Post.find({ author: ids });
  if (!userPost) res.json({ msg: "Post does not exist!" });
  const comments = await Comment.find({ post: userPost }).populate({
    path: "author",
    select: "firstName lastName",
  });
  res.json(comments);
};

module.exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) res.json({ msg: "Post does not exist!" });
  const user = await User.findById(req.user._id);
  const comment = new Comment({ text });
  comment.post = post._id;
  comment.author = user._id;
  const newComment = await comment.save();
  post.comments.push(newComment);
  user.comments.push(newComment);
  await newComment.populate({ path: "author", select: "firstName lastName" });
  await user.save();
  await post.save();
  res.json(newComment);
};
module.exports.editComment = async (req, res) => {
  const { id, commentId } = req.params;
  if (!id) res.json({ msg: "Post does not exist!" });
  const post = await Post.findByIdAndUpdate(id, {
    $elemMatch: {
      commentId: { text: { ...req.body } },
    },
  });
  const comment = await Comment.findByIdAndUpdate(commentId, {
    ...req.body,
  });
  if (!comment) res.json({ msg: "Comment does not exist!" });
  res.json({ succsess: true });
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  if (!id) res.json({ msg: "Post does not exist!" });
  const post = await Post.findByIdAndUpdate(id, {
    $pull: { comments: commentId },
  });
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) res.json({ msg: "Comment does not exist!" });
  res.json({ succsess: true });
};
