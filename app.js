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





// Example usage
///////////////////////////############## Mongo Session################## //////////////////////////////////


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









 // post requcets //
 app.post('/addhospitaldata', async (req, res) => {
    try {
        const { hospitalName, image, state, district, city, pincode, doctors } = req.body;
        console.log(hospitalName, image, state, district, city, pincode, doctors);

        const addhospital = new Hospitals({ hospitalName, image, state, district, city, pincode, doctors });
        const savehospital = await addhospital.save();
        console.log(savehospital);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error occurred while adding hospital data:', error);
        res.status(500).send('An error occurred while adding hospital data. Please try again later.');
    }
});
// testing the data 
app.post('/search-hospital', async (req, res) => {
    try {
        const userQuery = req.body.query.toLowerCase();

        // Search hospital data based on user input
        const matchingHospitals = await Hospitals.find({ hospitalName: { $regex: userQuery, $options: 'i' } });

        if (matchingHospitals.length > 0) {
            res.json({ 
                results: matchingHospitals.map(hospital => ({
                    hospitalName: hospital.hospitalName,
                    description: `Located in ${hospital.city}, ${hospital.state}`,
                }))
            });
        } else {
            res.json({ results: [] });
        }
    } catch (error) {
        console.error('Error occurred while searching hospitals:', error);
        res.status(500).json({ error: 'An error occurred while searching hospitals. Please try again later.' });
    }
});
app.post('/search-city', async (req, res) => {
    try {
        const userQuery = req.body.query.toLowerCase();

        const matchingHospitals = await Hospitals.find({ city: { $regex: userQuery, $options: 'i' } });

        if (matchingHospitals.length > 0) {
            res.json({ 
                results: matchingHospitals.map(hospital => ({
                    hospitalName: hospital.hospitalName,
                    description: `Located in ${hospital.city}, ${hospital.state}`,
                }))
            });
        } else {
            res.json({ results: [] });
        }
    } catch (error) {
        console.error('Error occurred while searching by city:', error);
        res.status(500).json({ error: 'An error occurred while searching by city. Please try again later.' });
    }
});
app.post('/search-pincode', async (req, res) => {
    try {
        const userQuery = req.body.query;

        const matchingHospitals = await Hospitals.find({ pincode: userQuery });

        if (matchingHospitals.length > 0) {
            res.json({ 
                results: matchingHospitals.map(hospital => ({
                    hospitalName: hospital.hospitalName,
                    description: `Located in ${hospital.city}, ${hospital.state}`,
                }))
            });
        } else {
            res.json({ results: [] });
        }
    } catch (error) {
        console.error('Error occurred while searching by pincode:', error);
        res.status(500).json({ error: 'An error occurred while searching by pincode. Please try again later.' });
    }
});

