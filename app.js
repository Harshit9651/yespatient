const express= require("express");
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
app.use(cors());
const flash = require('connect-flash');
app.use(flash());
const session = require('express-session');


const port = process.env.PORT;
const path = require("path");
const bycrpt = require("bcrypt");
const cron = require('node-cron');
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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

app.use(bodyParser.json());



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



// Configure Cloudinary
cloudinary.config({
  cloud_name:process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
api_secret: process.env.API_SECREAT
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


////////////// flash message content  ///////////////
app.use(session({
  secret: 'this is yespatient ', // Replace 'your-secret-key' with a random string
  resave: true,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  // Flash message for successful sign in
  res.locals.successSignInMsg = req.flash('successSignInMsg') || '';
  // Flash message for successful sign up
  res.locals.successSignUpMsg = req.flash('successSignUpMsg') || '';
  // Flash message for successful hospital data addition
  res.locals.successAddHospitalMsg = req.flash('successAddHospitalMsg') || '';
  next();
});


////////////////////////####### mongodb code  ##########///////////////
const mongodbsession = require("connect-mongodb-session")(session)
const store = new mongodbsession({
  uri:process.env.MONGODBATLS,
  collection:"mysessions",
 })



////////////////////mongodb 
require('./src/db/connect.js')
const Hospitals= require('./src/model/hosptals.js');
const SinUpData = require('./src/model/sinupdata.js');

 // Get  resquect //

app.get('/',(req,res)=>{
   
 res.render('index.ejs')
 })
 app.get('/searchbycityname',(req,res)=>{
    res.render('cityname.ejs')
 })
 app.get('/searchbyhospitalname',(req,res)=>{
  res.render('hospitalname.ejs')
})
app.get('/searchbypincode',(req,res)=>{
  res.render('pincode.ejs')
})
 app.get('/addhospital',(req,res)=>{
    res.render('addhospital.ejs')
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
app.get('/error',(req,res)=>{
  res.render('error.ejs')
})
app.get('/showfile',(req,res)=>{
  res.render('showfile.ejs')
})
 

 




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
    req.flash('successSignUpMsg', 'You signed up successfully!');
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

user: process.env.USERNAMEEMAIL, 
        pass: process.env.USERPASSWORDEMAIL
      },
      tls: {
        rejectUnAuthorized: true,
      }
    });

    let mailOptions = {
      from:process.env.USERNAMEEMAIL , // Sender address
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
        req.flash('successSignInMsg', 'Welcome again!');

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
    return res.status(400).json({ error: errors.array() });
  }

  const { verificationCode, email, newPassword } = req.body;

  try {
    const user = await SinUpData.findOne({ verificationCode, email });
    if (!user) {
      return res.status(400).render({ error: [{ msg: 'Invalid verification code or email' }] });
    }
const newhashpassword =  await bycrpt.hash(newPassword,10)
    user.password = newhashpassword; 
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).render({ error: [{ msg: 'Server error' }] });
  }
});
cron.schedule('0 * * * *', async () => {
  try {
    const result = await Hospitals.deleteMany({
      createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    console.log('Deleted old daily data:', result);
  } catch (error) {
    console.error('Error deleting old daily data:', error);
  }
});

// Define the route to add hospital data
app.post('/addhospitaldata', 
  upload.single('Image'),
  [
    body('hospitalName').notEmpty().withMessage('Hospital Name is required'),
    body('district').notEmpty().withMessage('District is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('pincode').isPostalCode('IN').withMessage('Valid Indian pincode is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).render({ error: errors.array() });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const { hospitalName, district, city, pincode } = req.body;
      const newHospital = new Hospitals({
        hospitalName,
        Image: result.secure_url,
        district,
        city,
        pincode
      });
      await newHospital.save();
      req.flash('successAddHospitalMsg', 'Hospital data saved successfully');
      res.redirect('/')
    } catch (error) {
      console.error('Error saving hospital data:', error);
      res.status(500).render({ error: 'Error saving hospital data' });
    }
  }
);
// Validation function to check if a string contains only letters and spaces
const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str);

// Route to handle POST requests for searching hospitals by city
app.post("/searchbycity", async (req, res) => {
  const { CityName } = req.body;
  
  // Validate city name
  if (!isAlpha(CityName)) {
    return res.status(500).render({ error: "City name should contain only letters and spaces" });
  }

  try {
    const data = await Hospitals.find({ city: CityName });
    console.log(data);
 
    res.render('showfile.ejs', { data });
  } catch (err) {
    console.error("Error searching hospitals by city", err);
    res.status(500).render({ error: "Internal server error" });
  }
});

// Route to handle POST requests for searching hospitals by name
app.post("/searchbyhospitalname", async (req, res) => {
  const { hospitalName } = req.body;
  
  // Validate hospital name
  if (!isAlpha(hospitalName)) {
    return res.status(500).render({ error: "Hospital name should contain only letters and spaces" });
  }

  try {
    const data = await Hospitals.find({ hospitalName: hospitalName });
    console.log(data);
    res.render('showfile.ejs', { data });
    
  } catch (err) {
    console.error("Error searching hospitals by name", err);
    res.status(500).render('error', { error: "Internal server error" });
  }
});

// Route to handle POST requests for searching hospitals by pincode
app.post("/searchbypincode", async (req, res) => {
  const { pincode } = req.body;

  // Validate pincode
  if (!/^\d{6}$/.test(pincode)) {
    res.status(500).render('error', { error: "Pincode must be 6 digits and in numerical form" });
    return; // Add a return statement to exit the function after sending the error response
  }

  try {
    const data = await Hospitals.find({ pincode: pincode });
    console.log(data);
    res.render('showfile.ejs', { data }); // Using status code 302 for temporary redirect
  } catch (err) {
    console.error("Error searching hospitals by pincode", err);
    res.status(500).render('error', { error: "Internal server error" });
  }
});
