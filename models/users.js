const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
    default:
      "https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png",
  },
  fileName: {
    type: String,
    required: true,
    default: "Portrait_Placeholder",
  },
});

const InvitationsSchema = new Schema({
  _id: String,
  fullName: String,
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
  friendInvites: [InvitationsSchema],
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
    url: "https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png",
  });
});

module.exports = mongoose.model("User", UserSchema);
