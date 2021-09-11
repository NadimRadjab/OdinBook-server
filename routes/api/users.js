const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const Post = require("../../models/posts");
const User = require("../../models/users");
const { isFriend } = require("../../middleware");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({ path: "posts", populate: { path: "comments" } })
      .populate({
        path: "friendList",
        select: "posts",
        populate: { path: "posts", populate: { path: "comments" } },
      });
    res.json(user);
  })
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: { path: "comments" },
      })
      .populate("friendList")
      .select("-password -isAdmin");
    if (!user) res.status(400).json({ message: "User does not exist!" });
    res.json(user);
  })
);

module.exports = router;
