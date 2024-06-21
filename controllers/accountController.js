require("dotenv").config();
const Account = require("../models/account");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const generateAccountNumber = require("../utils/generateAccountNumber");
const _ = require("lodash");
const secondsToMidnight = require("../utils/secondToMidnight");
const redis = require("../config/redis");

exports.profile = async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  const account = await Account.findOne({ accountId: req.user.accountId });

  try {
    res.send({
      status: "success",
      data: {
        user,
        account,
      },
    });
  } catch (err) {
    res.status(400).send({
      message: err,
      status: "error",
    });
  }
};

exports.createAccount = async (req, res) => {
  const accountId = uuidv4();
  const userId = uuidv4();
  const accountNumber = generateAccountNumber();

  const { userName, password, emailAddress, fullName } = req.body;

  const lastUser = await User.find().sort({ _id: -1 }).limit(1);
  const registrationNumber = lastUser[0]
    ? lastUser[0].registrationNumber + 1
    : 1;

  const user = new User({
    userId,
    fullName,
    accountNumber,
    emailAddress,
    registrationNumber,
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const account = new Account({
    accountId,
    userName,
    password: hashedPassword,
    userId,
  });

  try {
    const savedAccount = await account.save();
    const savedUser = await user.save();
    res.send({
      status: "success",
      message: "Registration successfull",
      data: {
        account: savedAccount,
        user: savedUser,
      },
    });
  } catch (err) {
    res.status(400).send({
      message: err,
      status: "error",
    });
  }
};

exports.login = async (req, res) => {
  const { userName, password } = req.body;

  const account = await Account.findOne({ userName });
  if (!account)
    return res.status(400).send({
      status: "error",
      message: "Invalid username or password",
    });

  const validPass = await bcrypt.compare(password, account.password);
  if (!validPass)
    return res.status(400).send({
      status: "error",
      message: "Invalid username or password",
    });

  account.lastLoginDateTime = new Date();
  account.save();
  await redis.del("accountsThreeDaysAgo");
  const token = jwt.sign(
    {
      accountId: account.accountId,
      userId: account.userId,
      email: account.emailAddress,
    },
    process.env.JWT_SECRET
  );
  res.header("Authorization", token).send({
    status: "success",
    message: "Login successfull",
    data: {
      token,
      account,
    },
  });
};

exports.getAccountLoginsOlderThanThreeDays = async (req, res) => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    let accountsThreeDaysAgo = await redis.get("accountsThreeDaysAgo");
    if (accountsThreeDaysAgo) {
      res.send({
        status: "success",
        message: "Success get data from cache",
        data: JSON.parse(accountsThreeDaysAgo),
      });
      return;
    } else {
      accountsThreeDaysAgo = await Account.find({
        lastLoginDateTime: { $lt: threeDaysAgo },
      });
      await redis.set("accountsThreeDaysAgo", JSON.stringify(accountsThreeDaysAgo));
      await redis.expire("accountsThreeDaysAgo", secondsToMidnight());
      res.send({
        status: "success",
        message: "Success get data from db",
        data: accountsThreeDaysAgo,
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
