const listing=require("./models/listing.js");
const review=require("./models/reviews.js");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.orignalUrl;
        req.flash("error","You must me logged in to create a listing");
        return res.redirect('/login');
    }
    next();

};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.local.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let {id} = req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You dont have the authority");
        return  res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let Review=await review.findById(reviewId);
    if(!Review.author.equals(res.locals.currUser._id)){
        req.flash("error","You dont have the authority");
        return  res.redirect(`/listings/${id}`);
    };
    next();
};