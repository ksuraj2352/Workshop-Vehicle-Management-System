const Joi = require("joi");
const mongoose = require("mongoose");
const { issueSchema } = require("./issue");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    trim: true,
  },
  myIssues: [issueSchema],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

function validateUsersSchema(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(40)
      .lowercase(),
    lastName: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(40)
      .lowercase(),
    email: Joi.string()
      .trim()
      .required()
      .min(5)
      .max(255)
      .email()
      .lowercase(),
    password: Joi.string()
      .trim()
      .required()
      .min(6)
      .max(255),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUsersSchema = validateUsersSchema;
