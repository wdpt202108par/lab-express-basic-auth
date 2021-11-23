const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const bodyparser = require('body-parser');
const saltRounds = 10;

const salt = bcryptjs.genSaltSync(saltRounds);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/registration", (req, res, next) => {
  res.render("registration");
});

router.post("/registration", (req, res, next) => {
  const { Username, Password } = Object.assign({}, req.body); 
  const hash = bcryptjs.hashSync(Password, salt);

  User.create({
    Username,
    passwordHash: hash
  })
  .then(createUser => {
    res.redirect("/")
  })
  .catch(error => next(error));
});

router.get("/login", (req, res, next) => {
  res.render("login")
});

router.post("login", (req, res, next) => {
  const { Username, Password } = req.body;
});

module.exports = router;
