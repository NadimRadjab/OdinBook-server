const faker = require("faker");
const Post = require("./models/posts");
const mongoose = require("mongoose");

const db = "mongodb://localhost:27017/odinbook";

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const makeFakeStuff = () => {
  const text = faker.lorem.text();
  const author = faker.name.findName();
  const comment = faker.lorem.words();
  return {
    text,
    author,
    comment,
  };
};
const makeFakePost = async () => {
  const { text, author, comment } = makeFakeStuff();
  const newPost = new Post({ text });
  //   newPost.comments.push(comment);
  await newPost.save();
};

for (let i = 0; i < 10; i++) {
  makeFakePost();
}
