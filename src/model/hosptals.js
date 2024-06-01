const mongoose = require("mongoose");
const { isAlpha, isNumeric } = require("validator");

const userSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: [true, "Hospital name is required"],
    trim: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9 ]+$/.test(v),
      message: "Hospital name should contain only alphanumeric characters and spaces"
    }
  },
  Image: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (v) => /^https?:\/\/.*\.(jpeg|jpg|gif|png)$/.test(v),
      message: "Please provide a valid image URL"
    }
  },
  district: {
    type: String,
    required: [true, "District is required"],
    trim: true,
    validate: {
      validator: (v) => isAlpha(v.replace(/\s/g, ''), 'en-US'),
      message: "District should contain only alphabetic characters"
    }
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    validate: {
      validator: (v) => isAlpha(v.replace(/\s/g, ''), 'en-US'),
      message: "City should contain only alphabetic characters"
    }
  },
  pincode: {
    type: Number,
    required: [true, "Pincode is required"],
    validate: {
      validator: (v) => isNumeric(v.toString(), 'en-US'),
      message: "Pincode should contain only numeric characters"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds
  }
});

module.exports = mongoose.model("Hospital", userSchema);

