const listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");

module.exports.index=async (req, res) => {
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newform=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.show= async (req,res)=>{
    let {id} = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author"
        },
        }).populate("owner");
    if(!Listing){
        req.flash("error","Listing not present");
    }
    res.render("listings/show.ejs", {Listing});
};

module.exports.edit=async (req, res)=>{
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","Listing not present");
    }
    res.render("listings/edit.ejs", {Listing});
};

module.exports.createlisting=async(req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.update=async(req, res)=>{
    let {id} = req.params;
    let Listing=await listing.findByIdAndUpdate (id, {...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async (req, res) => {
    const { id } = req.params;

    // find listing so we know which reviews to delete
    const Listing = await listing.findById(id);

    // if (Listing) {
    //     // delete all reviews whose _id exists in Listing.reviews
    //     await Review.deleteMany({ _id: { $in: Listing.reviews } });
    // }

    // now delete the listing itself
    await listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};