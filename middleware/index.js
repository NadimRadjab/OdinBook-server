const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");
const { userSchema, postSchema, commentSchema } = require("../schemas");
const Like = require("../models/likes");

module.exports.isPostAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ success: false });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isCommentAuthor = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ success: false });
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
module.exports.isFriend = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!req.user.friendList.includes(userId)) {
      const user = await User.findById(userId).select(
        "-password  -posts -comments -isAdmin -email -date"
      );
      const posts = [];
      res.json({ user, posts });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
  }
};

// module.exports.isViewingProfile = async (req, res, next) => {
//   try {
//     const { profileId } = req.params;
//   } catch (e) {
//     console.log(e);
//   }
// };

module.exports.isLiked = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({ msg: "Post not found" });
    const likes = await Like.find({ author: req.user._id });

    for (let like of likes) {
      if (post.likes.includes(like._id)) {
        await Post.findByIdAndUpdate(req.params.id, {
          $pull: {
            likes: like._id,
          },
        });
        await Like.findByIdAndDelete(like._id);
        return res.json(like._id);
      }
    }
    next();
  } catch (e) {
    console.log(e);
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
module.exports.validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    res.status(400).json({ message: msg });
  } else {
    next();
  }
};
