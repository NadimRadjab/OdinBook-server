const express = require("express");
const router = express.Router();
const Post = require("../../models/posts");

router.get("/", async (req, res) => {
  const post = await Post.find({}).populate("comments");
  if (!post) {
    res.status(400).json({ msg: "Post does not exist!" });
  } else {
    res.json(post);
  }
});
router.post("/", async (req, res) => {
  const { text } = req.body;
  try {
    const post = new Post({ text });
    const newPost = await post.save();
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body });
    if (!post) res.json({ msg: "Post does not exist!" });
    res.json({ succsess: true });
  } catch (e) {
    res.status(400).json({ succsess: false });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) res.json({ msg: "Post does not exist!" });
    res.json({ succsess: true });
  } catch (e) {
    res.status(400).json({ succsess: false });
  }
});
module.exports = router;
