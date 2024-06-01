const express= require("express");
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
app.use(cors());
const port = process.env.PORT;
const path = require("path");
const bycrpt = require("bcrypt");
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const flash = require('connect-flash');
app.use(flash());
require("./src/db/connect.js")
app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));

const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../public")));


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
// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads', 
    allowedFormats: ['jpg', 'png'],
});

const upload = multer({ storage: storage });//kha save krna h 
  

const uploadToCloudinary = async (file) => {
    if (file && file.path) {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } else {
      throw new Error('File buffer is undefined or null or blocked ');
    }
  };


////////////// session store data ///////////////





////////////////////////####### file imports ##########///////////////
require('./src/db/connect.js')
const Hospitals= require('./src/model/hosptals.js');
const SinUpData = require('./src/model/sinupdata.js');


 

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
 app.get('/sinin',(req,res)=>{
  res.render('sinin.ejs')
})
app.get('/resetpassword',(req,res)=>{
  res.render('resetpassword.ejs')
})

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
  
 

 




  const randomCode = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
  
app.post('/sinUp', [
  // Validate and sanitize inputs
  body('name').trim().isAlpha('en-US', { ignore: ' ' }).withMessage('Enter a valid name with alphabetic characters only.'),
  body('grId').trim().isAlphanumeric().withMessage('GR Id should contain only alphanumeric characters.'),
  body('hospitalName').trim().matches(/^[a-zA-Z0-9 ]+$/).withMessage('Hospital Name should contain only alphanumeric characters and spaces.'),
  body('hospitalArea').trim().matches(/^[a-zA-Z0-9 ]+$/).withMessage('Area of Hospital should contain only alphanumeric characters and spaces.'),
  body('chmo').trim().isAlpha('en-US', { ignore: ' ' }).withMessage('CHMO of Hospital should contain only alphabetic characters.'),
  body('phoneNumber').trim().isMobilePhone().withMessage('Valid phone number is required.'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure req.body
  const { name, grId, hospitalName, hospitalArea, chmo, phoneNumber, email, password, terms } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bycrpt.hash(password, 10); // Hash with salt rounds of 10

    // Create a new Sinupdata document with hashed password
    const usersinup = new SinUpData({
      name,
      grId,
      hospitalName,
      hospitalArea,
      chmo,
      phoneNumber,
      email,
      password: hashedPassword, // Save the hashed password
      terms,
      verificationCode: randomCode // Add verification code to the document
    });

    // Save the document to the database
    const sinupdatasave = await usersinup.save();
    console.log(sinupdatasave);

    // Respond with success message
    res.status(200).json({ message: 'Signup successful' });
    
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      logger: true,
      debug: true,
      secure: true,
      secureConnection: false,

      auth: {
        user: 'dremersio@gmail.com', // Your Gmail email address
        pass: 'fdmp qqny iupt yfly'
      },
      tls: {
        rejectUnAuthorized: true,
      }
    });

    let mailOptions = {
      from: 'dremersio@gmail.com', // Sender address
      to: email, // List of receivers
      subject: 'Welcome to Dremers', // Subject line
      html: `<p>Dear ${name},</p>
        <p>You have successfully signed up with YesPatient.</p>
        <p>A verification code has been sent to your email <B>${randomCode}</b>. Please remember to keep it safe as you will need it during login for authentication.</p>
        <p>YesPatient is a unique platform dedicated to fostering the dreams of ambitious healthcare professionals who aspire for greater heights but are hindered by various constraints. As a user, you have the opportunity to access a range of healthcare services and resources tailored to your needs.</p>
        <p>At YesPatient, we believe in the power of technology to transform healthcare delivery and improve patient outcomes. We provide a platform where healthcare providers can connect, collaborate, and access innovative solutions to enhance their practice and better serve their patients.</p>
        <p>Whether you are a healthcare professional seeking support or a patient looking for quality care, YesPatient welcomes you to join our mission of revolutionizing healthcare delivery. Together, we can create a healthier and more connected future for patients and providers alike.</p>
        <p>Thank you for choosing YesPatient. We look forward to embarking on this journey with you.</p>
        <p>Warm regards,</p>
        <p>Harshit Sharma<br>
        Founder of YesPatient <br>
        YesPatient Team</p>` // HTML formatted body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        req.flash('success', 'Welcome ' + name + '! You have successfully signed up.');
        res.redirect('/');
      }
    });

  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error saving user' });
  }
});
  //Sinin Post resquect 
  app.post('/signIn', [
    body('verificationCode').isNumeric().withMessage('Verification Code must be a number').isLength({ min: 6, max: 6 }).withMessage('Verification Code must be 6 digits long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { verificationCode, password } = req.body;

    try {
        // Find the user by verification code
        const user = await SinUpData.findOne({ verificationCode });
        if (!user) {
            return res.status(400).json({ error: 'Invalid verification code' });// i we dont want then 

        }

        // Check if the provided password matches the stored hashed password
        const isMatch = await bycrpt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

      // we redricet the next page 
        res.status(200).json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ error: 'Server error' });
    }
})


//Reset password 
app.post('/ResetPassword', [
  body('verificationCode').isNumeric().withMessage('Please enter a valid verification code'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { verificationCode, email, newPassword } = req.body;

  try {
    const user = await SinUpData.findOne({ verificationCode, email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid verification code or email' }] });
    }
const newhashpassword =  await bycrpt.hash(newPassword,10)
    user.password = newhashpassword; 
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});