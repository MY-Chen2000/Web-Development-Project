const express=require('express');
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

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res) => {
    res.render('home');
})
app.get('/campground',async (req,res) => {
    const camps = await campground.find({});
    res.render('campgrounds/index',{camps});
})
app.get('/campground/:id',async (req,res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/show',{camp});
})

app.listen(3000,() =>{
    console.log("Serving Port: 3000");
})