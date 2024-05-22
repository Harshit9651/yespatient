const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  hospitalName:String,
  Image:String,

  district:String,
  city:String,
  pincode:Number,




})
module.exports= new mongoose.model("Hospital",userSchema);

