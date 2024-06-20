const express = require('express');
const router = express.Router();
const User = require("../user/userSchema");
const Post = require("../user/postschema");
const fs = require("fs");
const path = require("path");
const upload = require("../utils/multer");
const sendmail = require("../utils/mail");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render('login', { user: req.user });
});

router.get('/logout-user/:id', function (req, res, next) {
  req.logOut(() => {
    res.redirect("/login");
  });
});

router.post('/login-user', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}));

router.get('/about', function (req, res, next) {
  res.render('about', { user: req.user });
});

router.get('/register', function (req, res, next) {
  res.render('register', { user: req.user });
});

router.post('/register-user', async function (req, res, next) {
  try {
    const { username, name, password, email } = req.body;
    await User.register({ name, username, email }, password);
    res.redirect('/login');
  } catch (error) {
    res.send(error.message);
  }
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  try {
    const posts = await Post.find().populate("user");
    console.log("Fetched Posts:", posts); // Debug log
    res.render('profile', { user: req.user, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.send(error);
  }
});

router.get("/forget-email", function (req, res, next) {
  res.render("user-forget-email", { user: req.user });
});

router.post("/forget-email", async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const url = `${req.protocol}://${req.get("host")}/forget-password/${user._id}`;
      sendmail(res, user, url);
      res.redirect(`/forget-password/${user._id}`);
    } else {
      res.redirect("/forget-email");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/forget-password/:id", function (req, res, next) {
  res.render("user-forget-password", { user: req.user, id: req.params.id });
});

router.post("/forget-password/:id", async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (user.resetPasswordToken === 1) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = 0;
      await user.save();
      res.redirect("/login");
    } else {
      res.send("Link Expired Try Again!");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/reset-password/:id", isLoggedIn, function (req, res, next) {
  res.render("userresetpassword", { user: req.user });
});

router.post("/reset-password/:id", isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    res.redirect(`/update-user/${req.user._id}`);
  } catch (error) {
    res.send(error);
  }
});

router.get("/userupdate/:id", isLoggedIn, function (req, res, next) {
  res.render("userupdate", { user: req.user });
});

router.post("/image/:id", isLoggedIn, upload.single("profilepic"), async function (req, res, next) {
  try {
    if (req.user.profilepic !== "default.png") {
      fs.unlinkSync(path.join(__dirname, "..", "public", "images", req.user.profilepic));
    }
    req.user.profilepic = req.file.filename;
    await req.user.save();
    res.redirect(`/userupdate/${req.params.id}`);
  } catch (error) {
    res.send(error);
  }
});

router.get("/delete-user/:id", isLoggedIn, async function (req, res, next) {
  try {
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    if (deleteuser.profilepic !== "default.png") {
      fs.unlinkSync(path.join(__dirname, "..", "public", "images", deleteuser.profilepic));
    }
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }
});

router.get("/postcreate", isLoggedIn, function (req, res, next) {
  res.render("postcreate", { user: req.user });
});

router.post("/postcreate", isLoggedIn, upload.single("media"), async function (req, res, next) {
  try {
    const newpost = new Post({
      title: req.body.title,
      media: req.file.filename,
      user: req.user._id
    });

    req.user.posts.push(newpost._id);
    await newpost.save();
    await req.user.save();
    res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
