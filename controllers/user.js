const User=require("../models/user.js");

module.exports.usersignup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.createuser=async(req,res)=>{
    try{
        let{username,email,password}= req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }
};

module.exports.userlogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postuser= async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutuser=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    })
    req.flash("succes","You are Logged Out");
    res.redirect("/listings"); 
};