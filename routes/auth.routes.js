const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// render sign in page
router.get("/auth/signin", (req, res, next) => {
  res.render("auth/signin", {});
})

router.post("/signin", (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const { username, password } = req.body;

  // make sure the user has submitted all info
  if (!username || !password) {
    res.render("auth/signin", {errorMessage: "Please enter both a username and a password"});
    return;
  }

  // search for user in db
  User.findOne({username})
    .then(function(userFromDb) {      
      // check that passwords are the same
      let isPwdValid = bcrypt.compareSync(password, userFromDb.password);

      if (isPwdValid) {
        // save user in a session
        req.session.currentUser = userFromDb;
        res.redirect("/main");
      } else {
        throw new Error("Password incorrect");
      }      
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
})

// render sign up page
router.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup", {});
})

router.post("/signup", (req, res, next) => {
  // get user info
  const { username, password } = req.body;

  // make sure the user has submitted all info
  if (!username || !password) {
    res.render("auth/signup", {errorMessage: "Please enter both a username and a password"});
    return;
  }

  // encrypt password
  let hashedPassword = bcrypt.hashSync(password, salt);

  // add user to db
  User.create({
    username,
    password: hashedPassword
  })
    .then(function(newUser) {
      req.session.currentUser = newUser;
      res.redirect("/main");
    })
    .catch(err => {
      // make sure username doesn't already exist
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })
})

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
})

module.exports = router;