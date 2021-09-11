const express = require("express");
const router = express.Router();
const { validateUser } = require("../../middleware");
const catchAsync = require("../../utils/catchAsync");
const { registerUser, logInUser } = require("../../controllers/auth");

router.post("/register", validateUser, catchAsync(registerUser));

router.post("/login", logInUser);
module.exports = router;
