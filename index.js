const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users")
const port = process.env.PORT || 8000;
const login = require("./routes/login")
const myProfile = require("./routes/myProfile");
const issue  = require("./routes/issue");

// Mongo Connection

mongoose
  .connect("mongodb://localhost/Vehicle-Management-System")
  .then(() => console.log("Connected to Mongo DB"))
  .catch(() => console.log("Could not connect to Mongo DB"));

const app = express();
app.use(express.json())
app.use("/api/users" , users);
app.use("/api/login" , login);
app.use("/api/myprofile" , myProfile);
app.use("/api/issues" , issue);




app.listen(port, () => console.log(`Listening on port ${port}`));
