const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');

router.get('/signup', (req, res) => res.render('signup'))

router.post('/signup', (req, res, next) => {
    const salt = bcryptjs.genSaltSync(10);
    const encryptedPassword = bcryptjs.hashSync(req.body.password, salt);

    User.create({
        username: req.body.username,
        passwordHash: encryptedPassword
    })
        .then(userFromDB =>{
            res.send('Utilisateur créé' , {myUser : userfromDB})
            console.log('Newly created user is:', userFromDB);
            res.redirect('/user-profile');
        })
        .catch(err => next(err))
})

router.get('/user-profile', (req, res, next)=>{
    res.render('user-profile');
})

// iteration 2 - step 2

router.get('/login', (req, res, next) => {
    res.render('auth-login');
})



module.exports = router;