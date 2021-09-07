const express = require("express");
const router = express.Router();
const Post = require("../../models/posts");

router.get("/", async (req, res) => {
  const post = await Post.find({});
  if (!post) {
    res.status(400).json({ msg: "Post does not exist!" });
  } else {
    res.json(post);
  }
});
module.exports = router;
