const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
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

  const hashedPassword = bcryptjs.hashSync(password, salt);

  User.create({username, password: hashedPassword})
    .then(userCreated => console.log("user created", userCreated))
    .catch(err => next(err))
})

module.exports = router;
