const User = require("../models/users");

module.exports.getHomePosts = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -email -gender -isAdmin -date"
  );
  res.json(user);
};

module.exports.getUserProfile = async (req, res) => {
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
};
