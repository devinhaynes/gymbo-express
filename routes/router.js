const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

//Routes
router.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})
  
router.get('/', (req, res) => {
    res.render('index');
});

//Profile route
router.get('/profile', (req, res) => {
    if(req.user) {
        res.render('profile', {
                user: req.user.username
            })
    } else {
        req.flash('danger', 'You must be logged in to view this page.');
        res.render('index');
    }
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/');
});

//Login routes
router.get('/login', (req, res) => {
    res.render('index');
})

router.post('/login', (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);    
})

//Register routes
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            email: email,
            username: username,
            password: password
        })

        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save((err) => {
                    if(err) {
                        req.flash('info', 'Account is already registered');
                        res.render('register');
                    }
                    req.flash('success', 'Registration successful');
                    res.render('index');
                })
            })
        })
    }
})

module.exports = router;