const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  grId: {
    type: String,
    required: [true, 'GR Id is required'],
    trim: true
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital Name is required'],
    trim: true
  },
  hospitalArea: {
    type: String,
    required: [true, 'Area of Hospital is required'],
    trim: true
  },
  chmo: {
    type: String,
    required: [true, 'CHMO of Hospital is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Valid phone number is required'],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Simple validation for a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: [true, 'Valid email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v); // Email regex validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  terms: {
    type: Boolean,
    required: [true, 'You must agree to the terms and conditions'],
    validate: {
      validator: function (v) {
        return v === true;
      },
      message: 'You must agree to the terms and conditions'
    }
  },
  verificationCode: {
    type: Number,
    required: true,
    min: 100000, // Minimum value for a 6-digit number
    max: 999999, // Maximum value for a 6-digit number
    validate: {
        validator: function (v) {
            return Number.isInteger(v) && v >= 100000 && v <= 999999; // Validate that it's a 6-digit number
        },
        message: props => `${props.value} is not a valid 6-digit number!`
    }
}
});

module.exports = mongoose.model("Sinupdata", userSchema);
