const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const listing =  require("../models/listing.js");
const Joi=require("joi");
const Review =require("../models/reviews.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({storage })

const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details[0].message);
    }
    else{
        next();
    }
} 
 
    
router.route("/")
    .get( wrapAsync(listingcontroller.index))
    .post(
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.createlisting));


router.get("/new",isLoggedIn,listingcontroller.newform);

router.route("/:id")
    .get(wrapAsync(listingcontroller.show))
    .put(isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingcontroller.update))
    .delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.delete));



 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontroller.edit));


module.exports = router;
