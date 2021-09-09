const express = require("express");
const mongoose = require("mongoose");

const postRoutes = require("./routes/api/posts");
const commentRoutes = require("./routes/api/comments");
const authRoutes = require("./routes/api/auth");
const userRoutes = require("./routes/api/user");

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

// app.use("/post", );
app.use("/posts", postRoutes);
app.use("/posts", commentRoutes);
app.use("/user", authRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`On ${port}`);
});
