const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const campground = require ('../models/campground');
const {campSchema} = require('../schema.js');

const valCamp = (req,res, next)=>{
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

router.get('/',catchAsync(async (req,res) => {
    const camps = await campground.find({});
    res.render('campgrounds/index',{camps});
}))

 /*  order matters*/
router.get('/new',catchAsync(async (req,res) => {
    res.render('campgrounds/new');
}))



router.get('/:id',catchAsync(async (req,res) => {
    const camp = await campground.findById(req.params.id).populate('reviews');
    if(!camp){
        req.flash('error','Failed to find the campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show',{camp});
}))
/***** */

router.post('/', valCamp, catchAsync(async(req,res,next) => {
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    req.flash('success','Successfully created a new campground');
    res.redirect( `/campground/${newCamp._id}`);
}))



router.get('/:id/edit',catchAsync(async (req,res) => {
    const camp = await campground.findById(req.params.id);
    if(!camp){
        req.flash('error','Failed to find the campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{camp});
}))



router.put('/:id',valCamp,catchAsync(async (req,res) => {
    const {id} = req.params;
    const newCamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a new campground');
    res.redirect( `/campground/${newCamp._id}`);
}))

router.delete('/:id',catchAsync( async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground');
    res.redirect( '/campground');
}))



module.exports = router;