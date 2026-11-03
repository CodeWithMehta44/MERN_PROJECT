const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(() => {
    console.log("connect to DB")
}).catch((err) => {
    console.log("err")
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


const sessionOption = {
    secret: "mysupersecretecode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//session-middleware
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//router
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req,res) =>{
    console.log('working')
    res.send("Hey,I am Groot")
});


app.all("/{*splat}", (req,res,next) => {
   next(new expressError(404,"page not found!!"));
});

//error handling middleware..
app.use((err,req,res,next) => {
    let {statusCode = 500,message="something is wrong "} = err;
    res.render("error.ejs",{err})
    // res.status(statusCode).send(message)
//   res.send("something went wrong ")
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080")
});