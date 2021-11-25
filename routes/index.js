const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const { Mongoose } = require("mongoose");
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// ITERATION 1 : sign up
router.get('/signup', function(req, res, next) {
  res.render('auth/signUp');
});

router.post('/signup', function(req, res, next) {
  const {username, password} = req.body;
  // BONUS : no empty field
  if(!username || !password) {
    res.render("auth/signUp", {
      errMessage: "Username or password should not be empty"
    });
    return;
  }

  const hashedPassword = bcryptjs.hashSync(password, salt);

  User.create({username, password: hashedPassword})
    .then(userCreated => res.render("myProfile", {
      username: userCreated.username} 
    ))
    .catch(err => {
      // BONUS : no repeated username
      if(err.code === 11000) {
        res.status(500).render("auth/signUp", {errMessage: "Username already used. Please choose another one."});
      } else {
        next(err);
      }
    })
})
  
// ITERATION 2 : login
router.get("/login", function(req, res, next) {
  res.render("auth/login", {})
})

router.post("/login", function(req, res, next) {
  const {username, password} = req.body
  //BONUS : no empty field
  if(!username || !password) { 
    res.render("auth/login", {
      errMessage: "Username or password should not be empty"
    })
    return;
  }
  //query db
  User.findOne({username: username})
    .then(function(userFromDb) {
      //BONUS : no invalid fields
      if(!userFromDb) {
        res.render("auth/login", {errMessage: "user not registered"})
        return;
      } else if (bcryptjs.compareSync(password, userFromDb.password)) {
        console.log('SESSION:', req.session);
        req.session.user = userFromDb.username;
        res.redirect('/myProfile')
      } else {
        res.render("auth/login", {errMessage: "invalid username/password"});
      }
    })
    .catch(err => console.log(err))
})


router.get('/myProfile', function (req, res, next) {
  if (!req.session.user) return res.redirect('/')

  const username = req.session.user
  res.render("myProfile", {username: username});
})


// ITERATION 3 : Protected Routes
router.get("/main", function(req,res,next) {
  if(!req.session.user){
    res.redirect('/');
    return;
  } else {
  res.render("main", {});
  }
})
router.get("/private", function(req,res,next) {
  if(!req.session.user){
    res.redirect('/')
  }
  res.render("private", {});
})

// Log out
router.get("/logout", function(req, res, next) {
  req.session.destroy()
  res.render("auth/login", {})
})

module.exports = router;