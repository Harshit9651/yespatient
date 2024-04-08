const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  hospitalName:String,
  image:String,
  state:String,
  district:String,
  city:String,
  pincode:Number,
  doctors:Number



})
module.exports= new mongoose.model("Hospital",userSchema);

