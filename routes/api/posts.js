const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isPostAuthor, validatePost } = require("../../middleware");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const {
  createPost,
  editPost,
  deletePost,
  getPosts,
  createPostWithImage,
} = require("../../controllers/posts");

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), catchAsync(getPosts))
  .post(
    passport.authenticate("jwt", { session: false }),
    validatePost,
    catchAsync(createPost)
  );
router.post(
  "/image",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  validatePost,
  catchAsync(createPostWithImage)
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
