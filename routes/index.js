const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require("mongoose");


const salt = bcryptjs.genSaltSync(saltRounds);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/registration", (req, res, next) => {
  res.render("registration");
});

router.post("/registration", (req, res, next) => {
  const { username, password } = req.body; 

  const hashedPassword = bcryptjs.hashSync(password, salt);

  User.create({
    username,
    passwordHash: hashedPassword
  })
  .then(userCreate => {
    res.redirect("/")
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('registration', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('registration', {
         errorMessage: 'Username needs to be unique. Either username is already used.'
      });
    } else {
      next(error);
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("login")
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.find({
    username
  })
  .then(userLoggedIn => {
    console.log(userLoggedIn);
    if(userLoggedIn.length === 0){
      res.redirect("/registration");
      };
    console.log(req);
    req.session.currentUser = userLoggedIn;
    res.redirect("/");
  })
  .catch(error => next(error));
});

module.exports = router;
