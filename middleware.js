const campground = require ('./models/campground');
const reviews = require('./models/review');
const expressError = require('./utils/expressError');
const {campSchema, reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
    req.flash('error','You must sign in to continue');
    return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const camp = await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do it!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await reviews.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do it!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}


module.exports.valCamp = (req,res, next)=>{
    const {error} = campSchema.validate(req.body);
    console.log(error);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400);
    }
    else{
        next();
    }
}

module.exports.valReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400);
    }
    else{
        next();
    }
}