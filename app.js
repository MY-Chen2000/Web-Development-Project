const express=require('express');
const Override = require('method-override');
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

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(Override('_method'));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res) => {
    res.render('home');
})
app.get('/campground',async (req,res) => {
    const camps = await campground.find({});
    res.render('campgrounds/index',{camps});
})

 /*  order matters*/
app.get('/campground/new',async (req,res) => {
    res.render('campgrounds/new');
}) 

app.get('/campground/:id',async (req,res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/show',{camp});
})
/***** */

app.get('/campground/:id/edit',async (req,res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
})

app.post('/campground', async(req,res) => {
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    res.redirect( `/campground/${newCamp._id}`);
})

app.put('/campground/:id',async (req,res) => {
    const {id} = req.params;
    const newCamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect( `/campground/${newCamp._id}`);
})

app.delete('/campground/:id', async (req,res) => {
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect( '/campground');
})

app.listen(3000,() =>{
    console.log("Serving Port: 3000");
})