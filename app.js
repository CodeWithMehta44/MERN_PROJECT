const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js")

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

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




//router
app.use("/listing", listing)
app.use("/listing/:id/reviews",review)


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