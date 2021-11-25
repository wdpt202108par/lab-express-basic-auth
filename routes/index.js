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
    .then(userCreated => res.render("myProfile", {
      username: userCreated.username} ))
    .catch(err => next(err))
})

router.get("/login", function(req, res, next) {
  res.render("auth/login", {})
})

router.post("/login", function(req, res, next) {
  console.log('SESSION:', req.session);
  const {username, password} = req.body
  //validation
  if(!username || !password) { //=> empty
    res.render("auth/login", {
      errMessage: "Username or password should not be empty"
    })
    return;
  }
  //query db
  User.findOne({username: username})
    .then(function(userFromDb) {
      if(!userFromDb) {
        res.render("auth/login", {errMessage: "user not registered"})
        return;
      } else if (bcryptjs.compareSync(password, userFromDb.password)) {
        res.render("/myProfile", {username: userFromDb.username});
      } else {
        res.render("auth/login", {errMessage: "invalid username/password"});
      }
    })
    .catch(err => console.log(err))
    //check if username and password are valid
    // render vers la page profile

})

// router.get("/myprofile/:name", function(req, res, next) {
//   res.render("myProfile", {username: req.params.name})
// })

module.exports = router;
