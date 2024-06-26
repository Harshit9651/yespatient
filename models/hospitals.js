const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  Image: String,
  district: String,
  city: String,
  pincode: String,
  createdAt: { type: Date, default: Date.now },
});

const Hospitals = mongoose.model('Hospitals', hospitalSchema);

module.exports = Hospitals;
