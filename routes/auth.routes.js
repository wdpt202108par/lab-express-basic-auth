// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds)

//route signup
router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

// route de publication
router.post('/signup', (req, res, next)=>{
    const {username, email, password} = req.body;
    // password = 1234
    // on  crypte notre password
    const hashedPassword = bcryptjs.hashSync(password, salt) // hashedPassword = A.jknvjefnv
    User.create({
        username: username,
        email: email,
        password: hashedPassword
    }).then(createUser =>{
       // res.redirect('') 
        console.log('create')
    
    })
    .catch(error => console.log(error))

})
    



module.exports = router;
