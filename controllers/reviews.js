const campground = require ('../models/campground');
const review = require('../models/review');

module.exports.createReview = async(req,res) => {
    const camp = await campground.findById(req.params.id);
    const newReview = new review(req.body.review);
    newReview.author = req.user._id;
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash('success','Successfully created a new review');
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect( `/campground/${id}`);
}