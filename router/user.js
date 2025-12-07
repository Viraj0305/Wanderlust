const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");

router.route("/signup")
    .get(usercontroller.usersignup)
    .post(wrapAsync(usercontroller.createuser));


router.route('/login')
    .get(usercontroller.userlogin)
    .post(saveRedirectUrl ,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.postuser);

router.get("/logout",usercontroller.logoutuser);


module.exports=router;