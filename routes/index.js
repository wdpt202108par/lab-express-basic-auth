const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signUp');
});

router.post('/signup', function(req, res, next) {
  const {username, password} = req.body;
  User.create({username, password})
    .then(userCreated => console.log("user created", userCreated))
    .catch(err => next(err))
})

module.exports = router;
