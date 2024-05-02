const mongoose = require("mongoose")
mongoose.connect("mongodb://0.0.0.0/useraccount").then(()=>console.log("db Connected!")).catch((error)=>console.log(error.message))