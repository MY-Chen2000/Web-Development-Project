if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express=require('express');
const Joi = require('joi');
const expressError = require('./utils/expressError');
const Override = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/camp')
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"),{
    useNewUrlParser:true
});
db.once('open',()=>{
    console.log("Connected")
});

const userRouter = require('./routes/users');
const campRouter = require('./routes/campground');
const reviewRouter = require('./routes/review');




const app=express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(Override('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/',userRouter);
app.use('/campground',campRouter);
app.use('/campground/:id/reviews',reviewRouter);

app.get('/',(req,res) => {
    res.render('home');
})


app.all('*',(req,res,next)=>{
    next(new expressError('Page not Found', 404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Error Occured";
    res.status(statusCode).render('error',{err});
})

app.listen(3000,() =>{
    console.log("Serving Port: 3000");
})