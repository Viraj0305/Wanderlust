const Review=require("../models/reviews.js");
const listing =  require("../models/listing.js");
const express=require("express");
const router=express.Router({mergeParams:true});

module.exports.createreview=async(req,res,)=>{
    let Listing=await listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author = req.user._id;
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${Listing._id}`);

};

module.exports.deletereview=async(req,res)=>{
    let {id,reviewId} =req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};