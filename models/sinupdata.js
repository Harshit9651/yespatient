const mongoose = require('mongoose');

const sinUpDataSchema = new mongoose.Schema({
  name: String,
  grId: String,
  hospitalName: String,
  hospitalArea: String,
  chmo: String,
  phoneNumber: String,
  email: String,
  password: String,
  terms: Boolean,
  verificationCode: Number,
  createdAt: { type: Date, default: Date.now },
});

const SinUpData = mongoose.model('SinUpData', sinUpDataSchema);

module.exports = SinUpData;
