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
        .then(userDB=>{
            res.send('Utilisateur créé')
            console.log('Newly created user is:', userDB);
            res.redirect('/user-profile');
        })
        .catch(err => next(err))
})

router.get('/user-profile', (req, res)=>{
    res.render('user-profile' ,{userInSession :req.session.currentUser});
})

// iteration 2 - step 2
/////////////////////L O G I N //////////////////

router.get('/login', (req, res, next) => {
    res.render('auth-login');
})

//iteration 3 - created main
router.get('/main', (req, res, next) => {
    if(req.session.currentUser){
        res.render('main');
    }
    res.redirect('/');
})

//.post() login route ==> to process from data
router.post('/login', (req, res, next) =>{
    const {username, password} = req.body;

    // to see the req.session
    console.log('SESSION =====> ', req.session);

    if (username === '' || password === ''){
        res.render('auth-login', {
            errorMessage: 'Please enter both username and password to login'
        });
        return ;
    }

User.findOne({username})
.then (user=>{
    if (!user){
        res.render('auth-login', {errorMessage: 'Username is not valid, please try with other username'});
        return ;
    }else if (bcryptjs.compareSync(password, user.passwordHash)){
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.render('user-profile', {userInSession: req.session.currentUser});
        //res.redirect('/user-profile');
    }
    else {
        res.render('auth-login', {errorMessage: 'Incorrect password! try again'});
    }
})
.catch(error => next(error));
})


//logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//iteration 3
//if user exists, afficher la page(private)

module.exports = router;