const Joi = require("joi");

module.exports.userSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  image: Joi.array(),
  gender: Joi.string().required(),
  friendList: Joi.array(),
  posts: Joi.array(),
  comments: Joi.array(),
});
module.exports.postSchema = Joi.object({
  image: Joi.array(),
  text: Joi.string().required(),
  author: Joi.object(),
  comments: Joi.array(),
});
module.exports.postSchemaImage = Joi.object({
  image: Joi.array(),
});
module.exports.commentSchema = Joi.object({
  text: Joi.string().required(),
  author: Joi.object(),
});
