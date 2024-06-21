require("dotenv").config();
const jwt = require("jsonwebtoken");
const Account = require("../models/account");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token)
    return res.status(401).send({
      message: "Access Denied",
      status: "unauthorize",
    });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findOne({ accountId: verified.accountId });
    if (!account) {
      throw new Error("Error");
    }
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      message: "Invalid Token",
      status: "unauthentication",
    });
  }
};

module.exports = auth;
