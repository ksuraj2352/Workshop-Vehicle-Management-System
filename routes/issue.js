const mongoose = require("mongoose");
const express = require("express");
const { validateIssue, Issue } = require("../model/issue");
const { verifyAuthorization } = require("../middleware/userAuthorization");
const { User } = require("../model/user");

const router = express.Router();

// CREATING A NEW ISSUE

router.post("/", [verifyAuthorization], async (req, res) => {
  const { error } = validateIssue(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const issue = new Issue({
    registrationNumber: req.body.registrationNumber,
    carBrand: req.body.carBrand,
    carModel: req.body.carModel,
    manufacturingYear: req.body.manufacturingYear,
    engineNumber: req.body.engineNumber,
    date: req.body.date,
    mobileNumber: req.body.mobileNumber,
    problemDescription: req.body.problemDescription,
  });

  async function pushIssueToUser(userObjectId) {
    const user = await User.findById(userObjectId);
    try {
      if (user) {
        await issue.save();
        user.myIssues.push(issue);
        await user.save();
        res.send(issue);
        // res.send(user);
      } else {
        res.status(400).send("User or token is Not valid.");
      }
    } catch (ex) {
      if (ex.keyPattern.registrationNumber) {
        return res.status(400).send("Duplicate Registration Number Detected");
      }

      if (ex.keyPattern.engineNumber) {
        return res.status(400).send("Duplicate Engine Number Detected");
      }

      res.send(ex.message);
    }
  }
  pushIssueToUser(req.user._id);
});

// LIST ALL ISSUES

router.get("/", [verifyAuthorization], async (req, res) => {
  // const limit = req.query.limit || null
  const pageNumber = req.query.page;
  const pageSize = req.query.size;
  const user = await User.findById(req.user._id);
  const allIssues = await Issue.find()
    .select("-problemDescription")
    .sort({date : -1})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    

  const countTotalIssues =  await Issue.find().count()
  const data = {allIssues,countTotalIssues}
  if (user) {
    res.send(data);
  } else {
    res.send("Something Wenr Wrong , Try Login Again.");
  }
});

// CHANGE THE STATUS OF AN ISSUE

router.put("/status/:id", [verifyAuthorization], async (req, res) => {
  const validObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  try {
    if (validObjectId) {
      const issue = await Issue.findById(req.params.id);
      if (issue.status === "pending") {
        User.findOneAndUpdate(
          { _id: req.user._id, "myIssues._id": req.params.id },
          { "myIssues.$.status": "completed" },
          { new: true },
          (_, user) => {
            if (!user) {
              res.send("no issue found for this user");
            } else if (user) {
              issue.status = "completed";
              issue.save();
              res.send(user);
            }
          }
        );
      } else {
        res.send("Something went wrong");
      }
    } else {
      res.send("Please send valid object Id");
    }
  } catch (ex) {
    res.send(ex.message);
  }
});

// LIST CURRENT USER'S CREATED ISSUES

router.get("/myissues", [verifyAuthorization], async (req, res) => {
  const userData = await User.findById(req.user._id).select("myIssues");
  if (userData && userData.myIssues.length >= 1) {
    res.send(userData);
  } else if (
    userData &&
    (userData.myIssues.length === 0 || userData.myIssues.length === null)
  ) {
    res.send("There are no issues.");
  } else {
    res.status(400).send("Something went wrong.");
  }
});

module.exports = router;
