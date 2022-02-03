const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../model/user");
const { verifyAuthorization } = require("../middleware/userAuthorization");
// const { adminAuthorization } = require("../middleware/adminAuthorization");

const router = express.Router();

router.get("/", [verifyAuthorization], async (req, res) => {
  // Get the Logged in User information

  const user = await User.findById({
    _id: req.user._id,
  });
  if (user) {
    res.status(200).send(user);
  } else {
    res.send("Something Wenr Wrong , Try Login Again.");
  }

  //   const id = req.params.id
  //   const user = await User.findById(id)
  //   res.status(200).send(user)
});

module.exports = router;
