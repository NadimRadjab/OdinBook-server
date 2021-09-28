require("dotenv").config();
const faker = require("faker");
const mongoose = require("mongoose");
const User = require("./models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = process.env.DB_URL || "mongodb://localhost:27017/odinbook";

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
  const password = process.env.FAKE_PASSWORD;
  const { firstName, lastName, email, gender } = makeFakeStuff();
  const user = new User({ firstName, lastName, email, password, gender });

  // await user.save();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return err;
    bcrypt.hash(user.password, salt, async (err, hash) => {
      if (err) return err;
      user.password = hash;
      user.fullName = `${firstName} ${lastName}`;

      user.default;
      const newUser = await user.save();
      jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 * 7 },
        (err, token) => {
          if (err) throw err;
          newUser.password = "";

          res.json({
            user: {
              ...newUser._doc,
            },
            token: "Bearer " + token,
          });
        }
      );
    });
  });
};

for (let i = 0; i < 10; i++) {
  makeFakeUsers();
}
