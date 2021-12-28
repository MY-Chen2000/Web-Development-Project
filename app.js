const express=require('express');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const {campSchema} = require('./schema.js');
const expressError = require('./utils/expressError');
const Override = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const campground = require ('./models/campground');
mongoose.connect('mongodb://localhost:27017/camp')
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"),{
    useNewUrlParser:true
});
db.once('open',()=>{
    console.log("Connected")
});


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

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(Override('_method'));

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res) => {
    res.render('home');
})
app.get('/campground',catchAsync(async (req,res) => {
    const camps = await campground.find({});
    res.render('campgrounds/index',{camps});
}))

 /*  order matters*/
app.get('/campground/new',catchAsync(async (req,res) => {
    res.render('campgrounds/new');
}))



app.get('/campground/:id',catchAsync(async (req,res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/show',{camp});
}))
/***** */

app.post('/campground', valCamp, catchAsync(async(req,res,next) => {
   
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    res.redirect( `/campground/${newCamp._id}`);
}))

app.get('/campground/:id/edit',catchAsync(async (req,res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
}))



app.put('/campground/:id',valCamp,catchAsync(async (req,res) => {
    const {id} = req.params;
    const newCamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect( `/campground/${newCamp._id}`);
}))

app.delete('/campground/:id',catchAsync( async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect( '/campground');
}))

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Error Occured";
    res.status(statusCode).render('error',{err});
})

app.listen(3000,() =>{
    console.log("Serving Port: 3000");
})