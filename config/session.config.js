const session = require('express-session');

const Mongo = require('connect-mongo');


module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave:false,
            saveUninitialized:true, 
            store: Mongo.create({
                mongoUrl: process.env.MONGODB_URI,
            })
        })
    )
}