const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport')
const passportLocal = require('passport-local')
const users = require('../controllers/users')

router.get('/register', users.renderRegisterForm)

router.post('/register', wrapAsync(users.authorizeRegister))

router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;