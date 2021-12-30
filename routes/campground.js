const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require ('../models/campground');
const {isLoggedIn, isAuthor, valCamp} = require('../middleware.js');
const campControll = require('../controllers/campgrounds')



router.route('/')
    .get(catchAsync(campControll.index))
    .post(isLoggedIn, valCamp, catchAsync(campControll.createCamp))

 /*  order matters*/
router.get('/new',isLoggedIn,catchAsync(campControll.newForm));

router.route('/:id')
    .get(catchAsync(campControll.idCamp))
    .put(isLoggedIn,isAuthor, valCamp,catchAsync(campControll.editCamp))
    .delete(isLoggedIn,catchAsync( campControll.deleteCamp))

/***** */



router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campControll.editForm));






module.exports = router;