const express = require("express");
const router = express.Router();
const Comment = require("../../models/comments");
const Post = require("../../models/posts");
const User = require("../../models/users");
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isCommentAuthor } = require("../../middleware");

router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) res.json({ msg: "Post does not exist!" });
    const user = await User.findById(req.user._id);
    const comment = new Comment({ text });
    comment.author = user._id;
    const newComment = await comment.save();
    post.comments.push(newComment);
    user.comments.push(newComment);
    await user.save();
    await post.save();
    res.json(newComment);
  })
);
router.post(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  isCommentAuthor,
  catchAsync(async (req, res) => {
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
  })
);
router.delete(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  isCommentAuthor,
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    if (!id) res.json({ msg: "Post does not exist!" });
    const post = await Post.findByIdAndUpdate(id, {
      $pull: { comments: commentId },
    });
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) res.json({ msg: "Comment does not exist!" });
    res.json({ succsess: true });
  })
);
module.exports = router;
