const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
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
