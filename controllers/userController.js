const User = require("../models/user");
const Account = require("../models/account");
const redis = require("../config/redis");
require("dotenv").config();

exports.listUser = async (req, res) => {
  try {
    let listUser = await redis.get(`listUser`);
    if (listUser) {
      redis.set(`listUser`, JSON.stringify(user));
      redis.expire(`listUser`, 10800);
      res.send({
        status: "success",
        message: "Success get data from cache",
        data: JSON.parse(listUser),
      });
    } else {
      listUser = await User.find();
      res.send({
        status: "success",
        message: "Success get data from db",
        data: listUser,
      });
    }
  } catch (err) {
    res.status(400).send({
      message: err,
      status: "error",
    });
  }
};

exports.updateUser = async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  const { emailAddress, fullName } = req.body;

  user.emailAddress = emailAddress;
  user.fullName = fullName;

  try {
    const data = await user.save();
    await redis.del(`listUser`);
    redis.set(`accountNumber:${user.accountNumber}`, JSON.stringify(data));
    redis.expire(`accountNumber:${user.accountNumber}`, 10800);
    redis.set(`registrationNumber:${user.registrationNumber}`, JSON.stringify(data));
    redis.expire(`registrationNumber:${user.registrationNumber}`, 10800);
    res.send({
      status: "success",
      message: "User updated successfully",
      data,
    });
  } catch (err) {
    res.status(400).send({
      message: err,
      status: "error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    await User.findOneAndDelete({ userId: req.user.userId });
    await Account.findOneAndDelete({ userId: req.user.userId });
    await redis.del(`listUser`);
    await redis.del(`accountsThreeDaysAgo`);
    redis.del(`accountNumber:${user.accountNumber}`);
    redis.del(`registrationNumber:${user.registrationNumber}`);
    res.send({
      status: "success",
      message: "User deleted Succesfully",
    });
  } catch (err) {
    res.status(400).send({
      message: err,
      status: "error",
    });
  }
};

exports.getUserByAccountNumber = async (req, res) => {
  const { accountNumber } = req.params;

  redis.get(`accountNumber:${accountNumber}`, async (err, result) => {
    if (result) {
      return res.send({
        status: "success",
        message: "Success get data from cache",
        data: JSON.parse(result),
      });
    } else {
      try {
        const user = await User.findOne({ accountNumber });
        if (!user)
          return res.status(404).send({
            message: "User not found",
            status: "error",
          });
        redis.set(`accountNumber:${accountNumber}`, JSON.stringify(user));
        redis.expire(`accountNumber:${accountNumber}`, 10800);
        res.send({
          status: "success",
          message: "Success get data from db",
          data: user,
        });
      } catch (err) {
        res.status(400).send({
          message: err,
          status: "error",
        });
      }
    }
  });
};

exports.getUserByRegistrationNumber = async (req, res) => {
  const { registrationNumber } = req.params;

  redis.get(`registrationNumber:${registrationNumber}`, async (err, result) => {
    if (result) {
      return res.send({
        status: "success",
        message: "Success get data from cache",
        data: JSON.parse(result),
      });
    } else {
      try {
        const user = await User.findOne({ registrationNumber });
        if (!user)
          return res.status(404).send({
            message: "User not found",
            status: "error",
          });
        redis.set(
          `registrationNumber:${registrationNumber}`,
          JSON.stringify(user)
        );
        redis.expire(`registrationNumber:${registrationNumber}`, 10800);
        res.send({
          status: "success",
          message: "Success get data from db",
          data: user,
        });
      } catch (err) {
        res.status(400).send({
          message: err,
          status: "error",
        });
      }
    }
  });
};
