const mongoose = require("mongoose")
require('dotenv').config();
mongoose.connect(process.env.mongo_url).then(()=>console.log("db Connected!")).catch((error)=>console.log(error.message))