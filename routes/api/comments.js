const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../../utils/catchAsync");
const { isCommentAuthor, validateComment } = require("../../middleware");
const {
  getComments,
  createComment,
  editComment,
  deleteComment,
} = require("../../controllers/comments");

router.get(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getComments)
);

router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  validateComment,
  catchAsync(createComment)
);
router
  .route("/:id/comments/:commentId")
  .post(
    passport.authenticate("jwt", { session: false }),
    isCommentAuthor,
    validateComment,
    catchAsync(editComment)
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    isCommentAuthor,
    catchAsync(deleteComment)
  );

module.exports = router;
