const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);

//route signup
router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

// route de publication
router.post('/signup', (req, res, next) => {
  const {username, email, password} = req.body;
  // password = 1234
  // on  crypte notre password
  const hashedPassword = bcryptjs.hashSync(password, salt) // hashedPassword = A.jknvjefnv
  User.create({
    username: username,
    email: email,
    password: hashedPassword
  }).then(createUser =>{
      res.redirect('/userProfile') 
  })
  .catch(error => console.log(error))
})

router.get('/userProfile', (req, res, next) => {
  res.render('users/user-profile');
})

//route login
router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        // req.session.currentUser = user
        res.render('users/user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/profile', function (req, res, next) {
  if (!req.session.currentUser) return res.redirect('/login')

  res.send('Bienvenue '+ req.session.currentUser.username)
})

module.exports = router;