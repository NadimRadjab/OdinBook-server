const express = require("express");
const router = express.Router();
const Post = require("../../models/posts");
const User = require("../../models/users");
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isPostAuthor } = require("../../middleware");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const { text } = req.body;
    try {
      const post = new Post({ text });
      const user = await User.findById(req.user._id);
      post.author = user._id;
      user.posts.push(post);
      const newPost = await post.save();
      await user.save();
      res.json(newPost);
    } catch (e) {
      console.log(e);
    }
  })
);
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isPostAuthor,
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(id, { ...req.body });
      if (!post) res.json({ msg: "Post does not exist!" });
      res.json({ succsess: true });
    } catch (e) {
      console.log(e);
      res.status(400).json({ succsess: false });
    }
  })
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isPostAuthor,
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id);
      res.json({ succsess: true });
    } catch (e) {
      res.status(400).json({ succsess: false });
    }
  })
);
module.exports = router;
