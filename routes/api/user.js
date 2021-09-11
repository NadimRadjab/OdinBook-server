// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const Post = require("../../models/posts");
// const User = require("../../models/users");

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const user = await User.findById(req.user.id)
//       .select("-password")
//       .populate({ path: "posts", populate: { path: "comments" } })
//       .populate({
//         path: "friendList",
//         select: "posts",
//         populate: { path: "posts", populate: { path: "comments" } },
//       });
//     res.json(user);
//   }
// );

// module.exports = router;
