const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true, index: true },
  emailAddress: { type: String, unique: true, required: true },
  registrationNumber: { type: String, required: true, unique: true, index: true }
});

module.exports = mongoose.model('User', userSchema);
