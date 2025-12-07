const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");
const listing =  require("../models/listing.js");
const {isLoggedIn,isAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details[0].message);
    }
    else{
        next();
    }
};


router.post("/",isLoggedIn,validateReview, wrapAsync(reviewcontroller.createreview));

router.delete("/:reviewId" ,isLoggedIn,isAuthor,wrapAsync(reviewcontroller.deletereview));

module.exports = router;


