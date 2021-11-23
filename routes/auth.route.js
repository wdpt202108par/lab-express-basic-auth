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
        .then(function (req, res, next) {
            res.send('Utilisateur créé')
            //res.redirect('/profile')
        })
        .catch(err => next(err))
})

module.exports = router;