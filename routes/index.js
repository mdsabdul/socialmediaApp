var express = require('express');
var router = express.Router();
const userModel = require("../user/userSchema")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/register', async function(req, res, next) {

  res.render('register');
});
router.get('/profile', async function(req, res, next) {

  res.render('profile');
});
router.post('/register-user', async function(req, res, next) {
try {
  const newUser =await userModel.create(req.body)
// await newUser.save;
  res.redirect('/login');
} catch (error) {
  res.send(error.message)
}
});

module.exports = router;
