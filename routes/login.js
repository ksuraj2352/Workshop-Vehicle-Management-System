const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../model/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

const secretToken = process.env.Vehicle_Secure_Key;

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({status : false ,errorType : "Invalid Email And Password."});
  }

  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  if (!checkPassword) {
    return res
      .status(400)
      .send({ status: false, errorType: "Invalid Email And Password." });
  }

  const token = jwt.sign({ _id: user._id, isAdmin : user.isAdmin }, secretToken, {expiresIn: "30m"} );
  const token2 = jwt.verify(token , secretToken)

  // const isHere = await User.findOne({_id : token2._id})
  

  // res.send({ token, ...token2,...isHere._doc });
  res.header('x-auth-token', token).send({status : true, ...token2 ,token });
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .trim()
      .lowercase()
      .min(5)
      .max(255),
    password: Joi.string()
      .trim()
      .required()
      .min(6)
      .max(255),
  });

  return schema.validate(user);
}

module.exports = router;
