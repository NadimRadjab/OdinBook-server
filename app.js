if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const morgan = require("morgan");

const passport = require("./passport");
const postRoutes = require("./routes/api/posts");
const commentRoutes = require("./routes/api/comments");
const authRoutes = require("./routes/api/auth");
const usersRoutes = require("./routes/api/users");
const friendsRoutes = require("./routes/api/friends");
const likeRoutes = require("./routes/api/likes");

const db = "mongodb://localhost:27017/odinbook";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo is connected"))
  .catch((e) => console.log(e));

const app = express();
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/friends", friendsRoutes);
app.use("/api/posts", postRoutes, commentRoutes, likeRoutes);

app.use("/api", usersRoutes);
app.use("/api/user", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`On ${port}`);
});
