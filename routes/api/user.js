const express = require("express");
const router = express.Router();
const passport = require("../../passport");
const User = require("../../models/users");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  }
);

router.get("/:id/friends", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const friends = await user.populate("friendList");
  const test = user.friendList.map((f) => f);
  console.log(friend);
});

router.post("/:id/friends/:friendId", async (req, res) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);
  user.friendList.push(friend);
  await user.save();
});
router.delete("/:id/friends/:friendId", async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findByIdAndUpdate(id, {
      $pull: { friendList: friendId },
    });

    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
