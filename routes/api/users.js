const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const { isFriend } = require("../../middleware");
const {
  getUserProfile,
  getMainUser,
  searchUsersProfile,
  getUserPosts,
  updateUserImage,
} = require("../../controllers/users");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getMainUser)
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  catchAsync(updateUserImage)
);
router.get(
  "/s",
  passport.authenticate("jwt", { session: false }),
  catchAsync(searchUsersProfile)
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(getUserProfile)
);
router.get(
  "/:userId/posts",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(getUserPosts)
);

module.exports = router;
