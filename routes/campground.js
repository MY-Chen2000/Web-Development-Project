const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require ('../models/campground');
const {isLoggedIn, isAuthor, valCamp} = require('../middleware');
const campControll = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(campControll.index))
    .post(isLoggedIn,  upload.array('image'), valCamp,  catchAsync(campControll.createCamp))


 /*  order matters*/
router.get('/new',isLoggedIn,catchAsync(campControll.newForm));

router.route('/:id')
    .get(catchAsync(campControll.idCamp))
    .put(isLoggedIn,isAuthor, valCamp,catchAsync(campControll.editCamp))
    .delete(isLoggedIn,catchAsync( campControll.deleteCamp))

/***** */



router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campControll.editForm));






module.exports = router;