const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require("./utils/expressError.js")
const listingSchema = require("./schema.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


main().then(() => {
    console.log("connect to DB")
}).catch((err) => {
    console.log("err")
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const validateListing = (err,req,res) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            throw new expressError(400, error)
        }else{
            next();
        }
}

//Index route..
app.get("/listing",
    wrapAsync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing })
}))

//New Route..
app.get("/listing/new",(req,res) => {
    res.render("listing/new.ejs")
})


//Show route..
app.get("/listing/:id", 
    wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{ listing })
}))

//Create Route..
app.post("/listing", validateListing,
    wrapAsync(async (req,res,next) => {
        // let {title, description, image, price, location, country} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save()
        res.redirect("/listing");
    }));

//edit route..
app.get("/listing/:id/edit", 
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{ listing })
}));

//update Route..
app.put("/listing/:id", validateListing,
    wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//Delete Route...
app.delete("/listing/:id",
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Listing which one is deleted is:",deletedListing)
    res.redirect("/listing")
}));


app.get("/", (req,res) =>{
    console.log('working')
    res.send("Hey,I am Groot")
});

// app.get("/testListing", async (req,res) => {
//     let sampleListing =  new Listing({
//         title:"My New Villa",
//         description: "Near the beach",
//         price:1200,
//         loction:"Panji, Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("sucessful testing")
// });

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