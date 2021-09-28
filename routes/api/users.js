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

//Get main user profile
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getMainUser)
);

//Update main user profile image
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  catchAsync(updateUserImage)
);
//Searching users
router.get(
  "/s",
  passport.authenticate("jwt", { session: false }),
  catchAsync(searchUsersProfile)
);

// Get profile for the user you are viewing
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(getUserProfile)
);
//Get posts for the user you are viewing
router.get(
  "/:userId/posts",
  passport.authenticate("jwt", { session: false }),
  isFriend,
  catchAsync(getUserPosts)
);

module.exports = router;
