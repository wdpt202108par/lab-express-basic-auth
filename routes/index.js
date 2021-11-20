const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/registration", (req, res, next) => {
  res.render("registration");
});

router.post("/registration", (req, res, next) => {
  const {Username, Password} = req.body; 
  const hash = bcrypt.hashSync(Password, salt);
  User.create({
    Username,
    passwordHash: hash
  })
  .then(createUser => {
    res.redirect("/")
  })
  .catch(error => next(error));
});

module.exports = router;
