const User = require("../models/users");

module.exports.getMainUser = async (req, res) => {
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
      populate: [
        {
          path: "likes",
          select: "author",
        },
        { path: "author", select: "firstName lastName fullName" },
      ],
      // populate: { path: "likes", select: "author" },
    })
    .populate({
      path: "friendList",
      select: "-isAdmin -password -comments -posts -email -friendList",
    })
    .select("-password -isAdmin");
  if (!user) res.status(400).json({ message: "User does not exist!" });
  res.json(user);
};
module.exports.searchUsersProfile = async (req, res) => {
  const name = req.query.name.split(" ", 2).join(" ");
  let search = new RegExp(name, "i");

  const user = await User.find({ fullName: search }).select(
    "firstName lastName fullName"
  );

  if (!user) res.status(400).json({ message: "User does not exist!" });
  res.json(user);
};

// .populate({
//   path: "posts",

//   populate: { path: "likes", select: "author" },
// })
