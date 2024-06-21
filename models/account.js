const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  accountId: { type: String, required: true, unique: true, index: true },
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  lastLoginDateTime: { type: Date, default: Date.now },
  userId: { type: String, required: true } 
});

module.exports = mongoose.model('Account', accountSchema);
