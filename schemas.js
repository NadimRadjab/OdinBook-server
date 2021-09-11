const Joi = require("joi");

module.exports.userSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  gender: Joi.string().required(),
  friendList: Joi.array(),
  posts: Joi.array(),
  comments: Joi.array(),
});
