const mongoose = require("mongoose");
const express = require("express");
const { validateUsersSchema, User } = require("../model/user");
const router = express.Router();
const bcrypt = require("bcrypt")


router.post("/", async (req, res) => {
  const { error } = validateUsersSchema(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already exists.");
  }

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save();

  res.send({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

module.exports = router;
