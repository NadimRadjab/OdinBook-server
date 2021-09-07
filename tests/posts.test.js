const post = require("../routes/api/posts");

const request = require("supertest");
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", post);

describe("GET /", () => {
  describe("I get all the users in database", () => {
    test("should get all posts", (done) => {
      //   const posts = await Post.find();
      request(app).get("/").expect("Content-Type", /json/).expect(200, done);
    });
  });
});

// test("testing route works", (done) => {
//   request(app)
//     .post("/test")
//     .type("form")
//     .send({ item: "hey" })
//     .then(() => {
//       request(app)
//         .get("/test")
//         .expect({ array: ["hey"] }, done);
//     });
// });
