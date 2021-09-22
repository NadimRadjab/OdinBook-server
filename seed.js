const faker = require("faker");
const mongoose = require("mongoose");
const User = require("./models/users");
const Post = require("./models/posts");
const Comment = require("./models/comments");
const db = "mongodb://localhost:27017/odinbook";

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const makeFakeStuff = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const gender = faker.name.gender();
  const text = faker.lorem.text();
  const name = faker.name.findName();
  const email = faker.internet.email();
  const comment = faker.lorem.words();
  return {
    text,
    name,
    comment,
    firstName,
    lastName,
    email,
    gender,
  };
};
const makeFakeUsers = async () => {
  const password = "1234";
  const { firstName, lastName, email, gender } = makeFakeStuff();
  const newUser = new User({ firstName, lastName, email, password, gender });
  await User.deleteMany({});
  await newUser.save();
};
const makeFakePost = async () => {
  const { text, comment } = makeFakeStuff();
  const owner = await User.findOne({});
  const newPost = new Post({ text });
  //   newPost.author = owner._id;
  await Post.deleteMany({});
  //   newPost.comments.push(comment);

  await newPost.save();
};

for (let i = 0; i < 10; i++) {
  makeFakeUsers();
}
