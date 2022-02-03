const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const secretToken = process.env.Vehicle_Secure_Key;

function verifyAuthorization(req, res, next) {
  let token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(400).send("No token Provided.");
  }
  try {
    const tokenData = jwt.verify(token, secretToken);
    req.user = tokenData;
    next()
  } catch (ex) {
    res.status(400).send("Unauthorised , token is invalid.");
  }
}

exports.verifyAuthorization = verifyAuthorization;
