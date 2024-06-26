const express = require('express');
const router = express.Router();
const hospitalController = require('../Controllers/hospitalcontroller.js');
const upload = require('../middleware/multerconfig.js'); 
const {isAuthenticate} = require('../middleware/auth.js')
const { body } = require('express-validator');


router.post('/addhospital', 
  [
    body('hospitalName').notEmpty().withMessage('Hospital name is required'),
    body('district').notEmpty().withMessage('District is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits long')
  ], 
  hospitalController.addHospitalData
);

router.post('/searchByCity', hospitalController.searchByCity);
router.post('/searchByHospitalName', hospitalController.searchByHospitalName);
router.post('/searchByPincode', hospitalController.searchByPincode);
router.get('/', hospitalController.rendermainpage)
router.get('/searchbycityname', hospitalController.renderCityNamePage);
router.get('/searchbyhospitalname', hospitalController.renderHospitalNamePage);
router.get('/searchbypincode', hospitalController.renderpincodePage);
router.get('/daily',isAuthenticate, hospitalController.renderdailypage);
router.get('/learnmore', hospitalController.renderlearnmorePage);
router.get('/showfile',hospitalController.rendershowfile)
router.post('/addhospitaldata',upload.single('Image'),hospitalController.addHospitalData)
      
module.exports = router;
