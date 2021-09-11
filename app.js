const express = require("express");
const mongoose = require("mongoose");
const passport = require("./passport");
const postRoutes = require("./routes/api/posts");
const commentRoutes = require("./routes/api/comments");
const authRoutes = require("./routes/api/auth");
const usersRoutes = require("./routes/api/users");
const userRoutes = require("./routes/api/user");
const friendsRoutes = require("./routes/api/friends");

const db = "mongodb://localhost:27017/odinbook";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo is connected"))
  .catch((e) => console.log(e));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", usersRoutes);
app.use("/posts", postRoutes, commentRoutes);
app.use("/user", authRoutes);
app.use("/friends", friendsRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`On ${port}`);
});
