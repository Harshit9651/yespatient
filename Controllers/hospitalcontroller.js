const Hospitals = require('../models/hospitals');
const fs = require('fs');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECREAT,
});
// Upload to Cloudinary
const uploadToCloudinary = async (file) => {
  if (file && file.path) {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } else {
    throw new Error('File buffer is undefined or null');
  }
};
exports.rendermainpage = async(req,res)=>{
    try{
        res.render('index.ejs')
    }catch(error){
        console.error('Error to show main ', error);
        res.status(500).json({ error: 'Error showing ejs page ' });
    }
}
 //find  get resquct data 
 exports.renderCityNamePage= async(req,res)=>{
    try{
        res.render('cityname.ejs')
    }catch(error){
        console.error('Error to show cityname ', error);
        res.status(500).json({ error: 'Error showing ejs page ' });
    }
 }
 exports.renderHospitalNamePage = async(req,res)=>{
    try{
        res.render('hospitalname.ejs')
    }catch(error){
        console.error('Error to show hospitalname ', error);
        res.status(500).json({ error: 'Error showing ejs page ' });
    }
 }
 exports.renderpincodePage= async(req,res)=>{
    try{
        res.render('pincode.ejs')
    }catch(error){
        console.error('Error to show pincode page ', error);
        res.status(500).json({ error: 'Error showing ejs page ' });
    }
 }
 exports.renderdailypage= async(req,res)=>{
  try{
      res.render('dailyadd.ejs')
  }catch(error){
      console.error('Error to show daliyadd page ', error);
      res.status(500).json({ error: 'Error showing ejs page ' });
  }
}
exports.renderlearnmorePage= async(req,res)=>{
  try{
      res.render('readmore.ejs')
  }catch(error){
      console.error('Error to show readmore page ', error);
      res.status(500).json({ error: 'Error showing ejs page ' });
  }
}
exports.rendershowfile= async(req,res)=>{
  try{
      res.render('showfile.ejs')
  }catch(error){
      console.error('Error to show  showfile page ', error);
      res.status(500).json({ error: 'Error showing ejs page ' });
  }
}

// Add hospital data

exports.addHospitalData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Please provide an image file' });
  }

  const filePath = req.file.path;
  console.log(filePath)

  // Check if the file exists before attempting upload
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'File not found on server' });
  }

  try {
    const result = await cloudinary.uploader.upload(filePath);
    const { hospitalName, district, city, pincode } = req.body;

    const newHospital = new Hospitals({
      hospitalName,
      Image: result.secure_url,
      district,
      city,
      pincode,
    });

    await newHospital.save();
    req.flash('successAddHospitalMsg', 'Hospital data saved successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error saving hospital data:', error);
    res.status(500).json({ error: 'Error saving hospital data' });
  } finally {
    // Always delete the file from local storage after uploading to Cloudinary
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
};
// Search hospital by city
exports.searchByCity = async (req, res) => {
  const { CityName } = req.body;
  if (!/^[A-Za-z\s]+$/.test(CityName)) {
    return res.status(500).render('error', { error: 'City name should contain only letters and spaces' });
  }

  try {
    const data = await Hospitals.find({ city: CityName });
    res.render('showfile', { data });
  } catch (err) {
    console.error('Error searching hospitals by city', err);
    res.status(500).render('error', { error: 'Internal server error' });
  }
};

// Search hospital by name
exports.searchByHospitalName = async (req, res) => {
  const { hospitalName } = req.body;
  if (!/^[A-Za-z\s]+$/.test(hospitalName)) {
    return res.status(500).render('error', { error: 'Hospital name should contain only letters and spaces' });
  }

  try {
    const data = await Hospitals.find({ hospitalName });
    res.render('showfile', { data });
  } catch (err) {
    console.error('Error searching hospitals by name', err);
    res.status(500).render('error', { error: 'Internal server error' });
  }
};

// Search hospital by pincode
exports.searchByPincode = async (req, res) => {
  const { pincode } = req.body;
  if (!/^\d{6}$/.test(pincode)) {
    res.status(500).render('error', { error: 'Pincode must be 6 digits and in numerical form' });
    return;
  }

  try {
    const data = await Hospitals.find({ pincode });
    res.render('showfile', { data });
  } catch (err) {
    console.error('Error searching hospitals by pincode', err);
    res.status(500).render('error', { error: 'Internal server error' });
  }
};
