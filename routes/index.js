var express = require('express');
var router = express.Router();
const userModel = require("../user/userSchema")

// const User = require("../models/usermodel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));
 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/logout-user', function(req, res, next) {
 req.logOut(()=>{
  res.redirect("/login")
 })
})
 


router.post('/login-user',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login"
}) ,
function(req,res,next){}
);

router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/register', async function(req, res, next) {

  res.render('register');
});
router.get('/profile',isLoggedIn, async function(req, res, next) {

  res.render('profile');
});
router.post('/register-user', async function(req, res, next) {
try {
  const {username,name , password ,email} = req.body
await userModel.register({name,username,email},password)
  // const newUser =await userModel.create(req.body)
// await newUser.save;
  res.redirect('/login');
} catch (error) {
  res.send(error.message)
}
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect("/login")
  }
}

module.exports = router;
