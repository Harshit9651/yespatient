const Hospitals = require('../models/hospitals');
const fs = require('fs');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

const Nodecache = require('node-cache')
const nodecache = new Nodecache();
const uploadToCloudinary = async (file) => {
  if (file && file.path) {
    //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
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

// Add hospital data

exports.addHospitalData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const imageFile = req.files['Image'][0];
        const IMAGE = await uploadToCloudinary(imageFile);
    const { hospitalName, district, city, pincode } = req.body;

    const newHospital = new Hospitals({
      hospitalName,
      Image: IMAGE,
      district,
      city,
      pincode,
    });

   const data =   await newHospital.save();
   console.log(data)
    req.flash('successAddHospitalMsg', 'Hospital data saved successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error saving hospital data:', error);
    res.status(500).json({ error: 'Error saving hospital data' });
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

