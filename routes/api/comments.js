const express = require("express");
const router = express.Router();
const Comment = require("../../models/comments");
const Post = require("../../models/posts");
const User = require("../../models/users");
const passport = require("passport");

const { isCommentAuthor } = require("../../middleware");

router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;
    try {
      if (!id) res.json({ msg: "Post does not exist!" });
      const post = await Post.findById(id);
      const user = await User.findById(req.user._id);
      const comment = new Comment({ text });
      comment.author = user._id;
      const newComment = await comment.save();
      post.comments.push(newComment);
      user.comments.push(newComment);
      await user.save();
      await post.save();
      res.json(newComment);
    } catch (e) {
      console.log(e);
    }
  }
);
router.post(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  isCommentAuthor,
  async (req, res) => {
    try {
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
    } catch (e) {
      res.status(400).json({ succsess: false });
    }
  }
);
router.delete(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  isCommentAuthor,
  async (req, res) => {
    try {
      const { id, commentId } = req.params;
      if (!id) res.json({ msg: "Post does not exist!" });
      const post = await Post.findByIdAndUpdate(id, {
        $pull: { comments: commentId },
      });
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) res.json({ msg: "Comment does not exist!" });
      res.json({ succsess: true });
    } catch (e) {
      res.status(400).json({ succsess: false });
    }
  }
);
module.exports = router;
