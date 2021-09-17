const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { likePost } = require("../../controllers/likes");
const { isLiked } = require("../../middleware");

router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  isLiked,
  catchAsync(likePost)
);

module.exports = router;
