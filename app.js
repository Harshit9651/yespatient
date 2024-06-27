const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
const multer = require('multer');

const connectDB = require('./Database/init.conection');
const hospitalRoutes = require('./routes/hospitalRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successAddHospitalMsg = req.flash('successAddHospitalMsg');
  res.locals.successSignUpMsg = req.flash('successSignUpMsg');
  next();
});

app.use('/', hospitalRoutes); //'/hospital'
app.use('/user', userRoutes);//'/user'

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
  
client.on('error', (err) => {
  console.error('Redis error:', err);
  console.log('hello')
});

const { cloudinary, storage } = require('./middleware/multerconfig.js');

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file) => {
    try {
        if (file && file.path) {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
        } else {
            throw new Error('File buffer is undefined or null');
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};