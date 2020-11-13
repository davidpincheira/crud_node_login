const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

passport.use(
    new LocalStrategy({ 
        usernameField : 'email', 
        passwordField : 'password', 
        passReqToCallback : true 
    }, async (req, email, password, done) => {
        const user = await User.findOne({email: email})
        if(!user) {
            return done(null, false, {message: "User not found"})
        } else {
            const match = await user.comparePassword(password)
            if(match){
                return done(null, user)
            } else {
                return done(null, false, {message: "incorrect password"})
            }
        }
    })
);

//almaceno en sesion el id del usuario
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})