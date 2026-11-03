const User = require("../models/user.js");

module.exports.renderSignup =(req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","Welcom to Wanderlust");
        res.redirect("/listing")
    })
    
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req,res) => {
    res.render("users/login.ejs")
};

module.exports.login = async(req,res) => {
            req.flash("success","Welcom to WanderLust!!");
            let redirectUrl = res.locals.redirectUrl || "/listing";
            res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logout((err => {
        if (err) {
            return next(err);
        }
        req.flash("success","logged you out")
        res.redirect("/listing")
    }))
};
