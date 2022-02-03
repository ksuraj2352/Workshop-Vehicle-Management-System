const Joi = require("joi");
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
      index : true,
      required: true,
      minlength: 8,
      maxlength: 10,
      trim: true,
      uppercase: true,
    },
    carBrand: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    carModel: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    manufacturingYear: {
      type: String,
      minlength: 4,
      maxlength: 4,
      required: true,
      trim: true,
    },
    // carVariant: {
    //   type: String,
    //   minlength: 4,
    //   maxlength: 4,
    //   required: true,
    // },
    engineNumber: {
      type: String,
      minlength: 10,
      maxlength: 255,
      required: true,
      trim: true,
      unique : true
    },
    date: { type: String, required: true, trim: true },
    // do the date validation in frontend side
    mobileNumber: {
      type: String,
      maxlength: 13,
      minlength: 10,
      required: true,
      trim: true,
    },

    problemDescription: {
      type: String,
      minlength: 20,
      maxlength: 1000,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

function validateIssue(issueDetail) {
  const schema = Joi.object({
    registrationNumber: Joi.string()
      .required()
      .trim()
      .uppercase()
      .min(8)
      .max(10),
    carBrand: Joi.string()
      .min(3)
      .max(255)
      .required(),
    carModel: Joi.string()
      .min(3)
      .max(255)
      .required(),
    manufacturingYear: Joi.string()
      .min(4)
      .max(4)
      .required()
      .trim(),
    engineNumber: Joi.string()
      .required()
      .trim()
      .uppercase()
      .min(10)
      .max(255),
    date: Joi.string()
      .required()
      .trim(),
    mobileNumber: Joi.string()
      .required()
      .min(10)
      .max(13),

    problemDescription: Joi.string()
      .min(20)
      .max(1000),
  });

  return schema.validate(issueDetail);
}

const Issue = mongoose.model("Issue", issueSchema);


exports.Issue = Issue;
exports.issueSchema = issueSchema
exports.validateIssue = validateIssue;
