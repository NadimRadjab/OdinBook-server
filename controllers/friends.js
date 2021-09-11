const User = require("../models/users");

module.exports.getFriends = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).populate({
    path: "friendList",
    select: "-password -isAdmin",
  });
  const friends = user.friendList.map((f) => f);
  if (!friends.length) {
    return res.status(400).json({ message: "Add some friends." });
  } else {
    res.json(friends);
  }
};
module.exports.addFriend = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findById(req.user._id);
  const friend = await User.findById(friendId);
  if (!friend) res.status(400).json({ message: "User does not exist!" });
  user.friendList.push(friend);
  friend.friendList.push(user);
  await user.save();
  await friend.save();
  res.json({ success: true });
};
module.exports.deleteFriend = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { friendList: friendId },
  });
  const friend = await User.findByIdAndUpdate(friendId, {
    $pull: { friendList: req.user._id },
  });

  await user.save();
  await friend.save();
  res.json({ success: true });
};
