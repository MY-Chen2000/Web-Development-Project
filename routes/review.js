const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const campground = require ('../models/campground');
const review = require('../models/review');
const {reviewSchema} = require('../schema.js');

const valReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400);
    }
    else{
        next();
    }
}


router.post('/',valReview, catchAsync(async(req,res) => {
    const camp = await campground.findById(req.params.id);
    const newReview = new review(req.body.review);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash('success','Successfully created a new review');
    res.redirect(`/campground/${camp._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect( `/campground/${id}`);
}))

module.exports = router;