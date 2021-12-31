const campground = require ('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req,res) => {
    const camps = await campground.find({});
    res.render('campgrounds/index',{camps});
}

module.exports.newForm = async (req,res) => {
    
    res.render('campgrounds/new');
}


module.exports.idCamp = async (req,res) => {
    const camp = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error','Failed to find the campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show',{camp});
}

module.exports.createCamp = async(req,res,next) => {
    const newCamp = new campground(req.body.campground);
    newCamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success','Successfully created a new campground');
    res.redirect( `/campground/${newCamp._id}`);
}

module.exports.editForm = async (req,res) => {
    const {id} = req.params;
    const camp = await campground.findById(id);
    if(!camp){
        req.flash('error','Failed to find the campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{camp});
}

module.exports.editCamp = async (req,res) => {
    const {id} = req.params;
    const newCamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a new campground');
    res.redirect( `/campground/${newCamp._id}`);
}

module.exports.deleteCamp = async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground');
    res.redirect( '/campground');
}