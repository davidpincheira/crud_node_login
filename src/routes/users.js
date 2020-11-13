const User = require('../models/User')
const express = require('express')
const router = express.Router()
const passport = require('passport') 

router.get('/users/signin', (req, res)=>{
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin', 
    failureFlash: true
}))

router.get('/users/signup', (req, res)=>{
    res.render('users/signup')
})

router.post('/users/signup', async(req, res)=>{
    const { name, email, password, confirm_password } = req.body
    const errors = []

    if(name.length == 0 || email.length == 0 || password.length == 0 || confirm_password.length == 0){
        errors.push({text: 'Please Complete All the fields'})
    }
    if(password !== confirm_password){
        errors.push({text: 'Password do not match'})
    }
    if(password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'})
    }
    if(errors.length>0){
        res.render('users/signup', {errors, name, email, password, confirm_password})
    } else {
        const emailExist = await User.findOne({email: email})

        if(emailExist){
            req.flash('error_msg', 'The Email exist')
            res.redirect('/users/signup')
        }

        const newUser = new User({ 
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        newUser.password = await newUser.encryptPassword(password)
        newUser.save()

        req.flash('success_msg', 'You are registered')
        res.redirect('/users/signin')
    }
})

router.get('/users/logout', (req, res)=>{
    req.logOut()
    res.redirect('/')
})

module.exports = router