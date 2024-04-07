const express= require("express");
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const path = require('path')
const port = process.env.PORT||3000;
const nodemailer = require('nodemailer');

const flash = require('connect-flash');
app.use(flash());
const axios = require('axios');



const publicDirectoryPath = path.join(__dirname,'../assets')
app.use(express.static(publicDirectoryPath))

const bodyParser = require('body-parser')

app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));
app.use(bodyParser.json());
//const methodoverride = require("method-override"); // for put patch and delete method
//app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../assets")));

const methodoverride = require("method-override"); // for put patch and delete method
app.use(methodoverride("_method"));

 app.listen(port,()=>{console.log(`app listing on port numer ${port}`)})
 const { dialogflow } = require('actions-on-google');
 app.get('/',(req,res)=>{
   
    res.render('index.ejs')
 })
 
// Sample hospital data
const hospitalData = [
    { name: 'jalan hospital Ratangarh', location: 'Location A', specialties: ['Cardiology', 'Orthopedics'] },
    { name: 'Hospital B', location: 'Location B', specialties: ['Neurology', 'Oncology'] },
    { name: 'Hospital C', location: 'Location C', specialties: ['Pediatrics', 'Dermatology'] }
];

app.use(bodyParser.json());

// Route for handling hospital search
/*
app.post('/search-hospital', (req, res) => {
    const userQuery = req.body.query.toLowerCase();

    // Search hospital data based on user input
    const foundHospital = hospitalData.find(hospital => hospital.name.toLowerCase() === userQuery);

    if (foundHospital) {
        res.json({ message: `Hospital Name: ${foundHospital.name}, Location: ${foundHospital.location}, Specialties: ${foundHospital.specialties.join(', ')}` });
    } else {
        res.json({ message: 'Hospital not found.' });
    }
});
*/
// Route for handling hospital search
app.post('/search-hospital', (req, res) => {
    const userQuery = req.body.query.toLowerCase();

    // Search hospital data based on user input
    const matchingHospitals = hospitalData.filter(hospital => hospital.name.toLowerCase().includes(userQuery));

    if (matchingHospitals.length > 0) {
        const message = matchingHospitals.map(hospital => {
            return `Hospital Name: ${hospital.name}, Location: ${hospital.location}, Specialties: ${hospital.specialties.join(', ')}`;
        }).join('\n');
        res.json({ message: message });
    } else {
        res.json({ message: 'No hospitals found matching your query.' });
    }
});


 // POST endpoint to handle Dialogflow requests

 app.get('/ram',(req,res)=>{
    res.render('test.ejs')
 })
