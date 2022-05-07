const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport')
const passportLocal = require('passport-local')
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(wrapAsync(users.authorizeRegister))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;