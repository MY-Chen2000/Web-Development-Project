const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {valReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewControll = require('../controllers/reviews')



router.post('/',isLoggedIn,valReview, catchAsync(reviewControll.createReview));

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(reviewControll.deleteReview));

module.exports = router;