const User = require("../models/users");

//Send invites and cancel invites
module.exports.sendFriendInvetation = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findById(req.user._id).select("fullName image");
  const friend = await User.findById(friendId);
  if (!friend) res.status(400).json({ message: "User does not exist!" });
  friend.friendInvites.push(user);

  await friend.save();
  res.json(user);
};
module.exports.cancelFriendInvetation = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findByIdAndUpdate(friendId, {
    $pull: { friendInvites: { _id: req.user._id.toString() } },
  });
  await user.save();
  res.json({ success: true });
};

//Remove invites
module.exports.removeFriendInvetation = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { friendInvites: { _id: friendId } },
  });
  await user.save();
  res.json({ success: true });
};

//Add a friend and remove a friend
module.exports.addFriend = async (req, res) => {
  const { friendId } = req.params;
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { friendInvites: { _id: friendId } },
  });
  const friend = await User.findById(friendId);
  if (!friend) res.status(400).json({ message: "User does not exist!" });
  user.friendList.push(friend);
  friend.friendList.push(user);

  await user.save();
  await friend.save();
  res.json({ user, friend });
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
