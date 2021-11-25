// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs')

router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

router.post('signup', (req, res, next)=>{
    const {username, email, password} = req.body;
})



module.exports = router;
