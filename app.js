const express= require("express");
const cors = require('cors');

const dotenv = require('dotenv'); // Import dotenv package

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT ||3000;
const path = require("path");



const bycrpt = require("bcrypt");
const nodemailer = require('nodemailer');


const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
const session = require("express-session")
app.use(cookieParser());

const flash = require('connect-flash');
app.use(flash());
require("./src/db/connect.js")
/*app.listen(port,()=>{
    console.log("server run successfully")
})
*/

app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));
//const methodoverride = require("method-override"); // for put patch and delete method
//app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../public")));


const mongodbsession = require("connect-mongodb-session")(session)

const bodyParser = require('body-parser');

const methodoverride = require("method-override"); // for put patch and delete method
app.use(methodoverride("_method"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



// Configure Cloudinary
cloudinary.config({
  cloud_name:'drxgaesoh',
  api_key: '911397189256837',
  api_secret: '3u2KB4BndKIcxurUbB7hz9Lsy2s',
});

// Configure MongoDB connection

// Create a simple mongoose schema




// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads', // Cloudinary folder where you want to store files
    allowedFormats: ['jpg', 'png'],
});

const upload = multer({ storage: storage });//kha save krna h 
  

const uploadToCloudinary = async (file) => {
    if (file && file.path) {
      //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } else {
      throw new Error('File buffer is undefined or null');
    }
  };





////////////////////////####### file imports ##########///////////////
require('./src/db/connect.js')
const Hospitals= require('./src/model/hosptals.js');


 

app.use(bodyParser.json());




 // Get  resquect //

 app.get('/',(req,res)=>{
   
    res.render('index.ejs')
 })
 app.get('/ram',(req,res)=>{
    res.render('test.ejs')
 })
 app.get('/addhospital',(req,res)=>{
    res.render('addhospital.ejs')
 })
 app.get('/pincode',(req,res)=>{
    res.render('pincode.ejs')
 })
 app.get('/daily',(req,res)=>{
    res.render('dailyadd.ejs')
 })
 app.get('/learnmore',(req,res)=>{
    res.render('readmore.ejs')
 })
 app.get('/sinup',(req,res)=>{
    res.render('sinup.ejs')
 })







app.post('/addhospitaldata', upload.single('Image'), async (req, res) => {
    try {
      const { hospitalName, district, city, pincode } = req.body;
      const IMAGE = await uploadToCloudinary(req.file); // Use req.file instead of req.files
  
      console.log(hospitalName, district, city, pincode, IMAGE);
  
      const addhospital = new Hospitals({ hospitalName, district, city, pincode, Image: IMAGE });
      const savehospital = await addhospital.save();
      console.log(savehospital);
      
      res.redirect('/');
    } catch (error) {
      console.error('Error occurred while adding hospital data:', error);
      res.status(500).send('An error occurred while adding hospital data. Please try again later.');
    }
  });
  
// Search routes

app.get('/search/pincode', async (req, res) => {
    const { pincode } = req.query;
    try {
      const hospitals = await Hospitals.find({ pincode: pincode });
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching by pincode.' });
    }
  });
  
  app.get('/search/hospital', async (req, res) => {
    const { hospitalName } = req.query;
    try {
      const hospitals = await Hospitals.find({ hospitalName: new RegExp(hospitalName, 'i') });
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching by hospital name.' });
    }
  });
  
  app.get('/search/city', async (req, res) => {
    const { city } = req.query;
    try {
      const hospitals = await Hospitals.find({ city: new RegExp(city, 'i') });
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching by city.' });
    }
  });
  
 

 