const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
    default:
      "https://www.baytekent.com/wp-content/uploads/2016/12/facebook-default-no-profile-pic1.jpg",
  },
  fileName: {
    type: String,
    required: true,
    default: "Portrait_Placeholder",
  },
});

const invitationsSchema = new Schema({
  fullName: {
    type: String,
  },
  image: [],
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  image: [ImageSchema],

  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  friendInvites: [invitationsSchema],
  friendList: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  unreadMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  date: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.virtual("default").get(function () {
  return this.image.push({
    url: "https://www.baytekent.com/wp-content/uploads/2016/12/facebook-default-no-profile-pic1.jpg",
  });
});

module.exports = mongoose.model("User", UserSchema);
