const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  accountId: { type: String, required: true, unique: true, index: true },
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  lastLoginDateTime: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

const Account = mongoose.model("Account", accountSchema);

Account.createIndexes({
  userName: 1,
});

module.exports = Account;
