const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isPostAuthor, validatePost } = require("../../middleware");
const {
  createPost,
  editPost,
  deletePost,
  getPosts,
} = require("../../controllers/posts");

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), catchAsync(getPosts))
  .post(
    passport.authenticate("jwt", { session: false }),
    validatePost,
    catchAsync(createPost)
  );

router
  .route("/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    isPostAuthor,
    validatePost,
    catchAsync(editPost)
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    isPostAuthor,
    catchAsync(deletePost)
  );

module.exports = router;
