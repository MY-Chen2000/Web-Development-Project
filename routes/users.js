const express = require('express');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const router = express.Router();
const userControll = require('../controllers/users');

router.route('/register')
    .get(userControll.renderRegister)
    .post(catchAsync(userControll.register))

router.route('/login')
    .get(userControll.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),userControll.login)


router.get('/logout',userControll.logout);

module.exports = router;