
const mongoose = require("mongoose");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yespatient');
console.log("mongoose responsed sucessfully");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
//mongodb://127.0.0.1:27017/Dreamers ye hai add me
//mongodb+srv://harshit9660518978:harshit9660518978@cluster0.sbirrhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0