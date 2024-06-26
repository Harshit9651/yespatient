const SinUpData = require('../models/sinupdata');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
//sinin 
exports.rendersininpage = async(req,res)=>{
  try{
    await res.render('sinin.ejs')
  }catch(error){
    console.log(`error to show sinin page`)
    res.status(500).send({error:"error to show the ejs page "})
  }
}

// Sign up
exports.rendersinuppage = async(req,res)=>{
  try{
    await res.render('sinup.ejs')
  }catch(error){
    console.log(`error to show sinup page`)
    res.status(500).send({error:"error to show the ejs page "})
  }
}
exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, grId, hospitalName, hospitalArea, chmo, phoneNumber, email, password, terms } = req.body;
  const randomCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const usersinup = new SinUpData({
      name,
      grId,
      hospitalName,
      hospitalArea,
      chmo,
      phoneNumber,
      email,
      password: hashedPassword,
      terms,
      verificationCode: randomCode,
    });

    const sinupdatasave = await usersinup.save();
    req.flash('successSignUpMsg', 'You signed up successfully!');
    res.redirect('/daily');


    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USERNAMEEMAIL,
        pass: process.env.USERPASSWORDEMAIL,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    let mailOptions = {
      from: process.env.USERNAMEEMAIL,
      to: email,
      subject: 'Welcome to Dremers',
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
        YesPatient Team</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       
      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Error signing up' });
  }
};


exports.renderResetPasswordPage = async (req, res) => {
  try {
    res.render('resetpassword.ejs');
  } catch (error) {
    console.log(`Error showing reset password page:`, error);
    res.status(500).send({ error: "Error showing the ejs page" });
  }
};


// Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await SinUpData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};
exports.rendererrorpage = async(req,res)=>{
  try{
    await res.render('error.ejs')
  }catch(error){
    console.log(`error to show error  page`)
    res.status(500).send({error:"error to show the ejs page "})
  }
}


exports.signIn = async (req, res) => {
  const { email, password, verificationCode } = req.body;

  try {
    const user = await SinUpData.findOne({verificationCode});

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
     
    };

   
    res.redirect('/daily');
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Error signing in' });
  }
};