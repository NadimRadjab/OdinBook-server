const express = require("express");
const mongoose = require("mongoose");

const postRoutes = require("./routes/api/posts");

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

app.use("/posts", postRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`On ${port}`);
});