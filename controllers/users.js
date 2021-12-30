const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.register = async(req,res)=>{
    try{
        const {email,username,password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password);
        req.login(registerUser, err =>{
            if(err){
                return next(err);
            }else{
                req.flash('success',"Welcome!");
                res.redirect('/campground');
            }
        }); 
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }   
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.login = (req,res)=>{
    req.flash('success',"Welcom back!");
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut();
    req.flash('success',"Goodbye!")
    res.redirect('/campground');
}