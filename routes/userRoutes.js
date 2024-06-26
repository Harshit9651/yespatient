const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usercontroller.js');
const { body } = require('express-validator');



router.get('/sinup',userController.rendersinuppage)
router.post('/signup', 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('grId').notEmpty().withMessage('GR ID is required'),
    body('hospitalName').notEmpty().withMessage('Hospital name is required'),
    body('hospitalArea').notEmpty().withMessage('Hospital area is required'),
    body('chmo').notEmpty().withMessage('CHMO is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('terms').equals('true').withMessage('You must accept the terms and conditions')
  ], 
  userController.signUp
);
router.get('/resetpassword', userController.renderResetPasswordPage);
router.post('/resetpassword', userController.resetPassword);
router.get('/sinin',userController.rendersininpage);
router.get('/error',userController.rendererrorpage)
router.post('/signIn',userController.signIn)
module.exports = router;
