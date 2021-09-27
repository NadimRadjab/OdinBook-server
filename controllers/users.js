const User = require("../models/users");
const Post = require("../models/posts");
const { cloudinary } = require("../cloudinary");

module.exports.getMainUser = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password -email -gender -isAdmin -date")
    .populate([
      { path: "friendList", select: "fullName image chats" },
      { path: "unreadMessages", select: "sender" },
    ]);

  res.json(user);
};

module.exports.updateUserImage = async (req, res) => {
  const newPath = req.file.path.replace("/upload", "/upload/w_300");
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { image: { url: newPath, fileName: req.file.filename } },
  });

  const fileName = user.image[0].fileName;
  await cloudinary.uploader.destroy(fileName);
  await user.save();
  res.json({ url: req.file.path, fileName: req.file.fileName });
};

module.exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId)
    .select("-password -isAdmin ")
    .populate([
      {
        path: "friendList",
        select: "fullName image",
      },
    ]);

  if (!user) res.status(400).json({ message: "User does not exist!" });
  res.json({ user });
};
module.exports.searchUsersProfile = async (req, res) => {
  const name = req.query.name.split(" ", 2).join(" ");
  let search = new RegExp(name, "i");

  const user = await User.find({ fullName: search }).select(
    "firstName lastName fullName image"
  );

  if (!user) res.status(400).json({ message: "User does not exist!" });
  res.json(user);
};

module.exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  const posts = await Post.find({ author: userId })
    .populate({
      path: "author",
      select: "firstName lastName fullName image",
    })
    .populate({
      path: "likes",
      select: "author",
    });

  res.json({ posts });
};
