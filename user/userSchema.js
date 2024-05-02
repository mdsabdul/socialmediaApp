const mongoose = require("mongoose")
const { stringify } = require("postcss")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true , "name is required"],
        minLength:[4,"name should be atleast four character long"]
    },
    username:{
        type:String,
        trim:true,
        unique:true,
        required:[true, "username is required"],
        minLength:[4,"username should be atleast four character long"]
    },

    email:{
        type:String,
        trim:true,
        unique:true,
        lowercase:true,
        required:[true , "emmail is required"],
        minLength:[4,"email should be atleast four character long"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address" ],
    },
    password:String,


},
{timestamps:true}
);

const upload = mongoose.model("usermodel",userSchema)
module.exports = upload;