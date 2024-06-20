const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    profilepic: {
        type: String,
        default: "default.png"
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minLength: [4, "Name should be at least four characters long"]
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Username is required"],
        minLength: [4, "Username should be at least four characters long"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
        minLength: [4, "Email should be at least four characters long"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    resetPasswordToken: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
