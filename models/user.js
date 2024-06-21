const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true, index: true },
  emailAddress: { type: String, unique: true, required: true },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
});

const User = mongoose.model("User", userSchema);

User.createIndexes({
  accountNumber: 1,
  registrationNumber: 1,
});

module.exports = User;
