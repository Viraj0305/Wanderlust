if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoose_url='mongodb://127.0.0.1:27017/wanderlust';
const listing =  require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const listRouter=require("./router/list.js");
const reviewRouter=require("./router/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js"); 
const userRouter=require("./router/user.js");
main().then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("There was some error in connection");
});

async function main() {
    await mongoose.connect(mongoose_url);
}


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
    secret:"mysuperSecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now( + 7*24*60*60*1000 ),
        maxAge:7*24*60*60*1000,
    },
    httpOnly:true,
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let refisterdUser= await User.register(fakeUser,"helloworld");
});
app.use("/listings",listRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/testlisting", async (req,res)=>{
    let sample = new listing({
        title:"My new villa",
        description:"By the beach",
        price:1200,
        location:"Goa",
        country:"India",
    });

    await sample.save();
    console.log("Sample was save");
    res.send("Successful");
});


// app.use((req,res,next)=>{
//     next(new ExpressError(404,'page not found'));
// });

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080, ()=>{
    console.log("Server is listening on 8080");
});
