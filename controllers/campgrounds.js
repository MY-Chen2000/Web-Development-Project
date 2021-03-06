const campground = require ('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
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
        req.flash('error','Failed to find the movie');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show',{camp});
}

module.exports.createCamp = async(req,res,next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success','Successfully created a new movie');
    res.redirect( `/campground/${newCamp._id}`);
}

module.exports.editForm = async (req,res) => {
    const {id} = req.params;
    const camp = await campground.findById(id);
    if(!camp){
        req.flash('error','Failed to find the movie');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{camp});
}

module.exports.editCamp = async (req,res) => {
    const {id} = req.params;
    const newCamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.image.push(...imgs);
    await newCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated a movie');
    res.redirect( `/campground/${newCamp._id}`);
}

module.exports.deleteCamp = async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a movie');
    res.redirect( '/campground');
}