const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


main().then(() => {
    console.log("connect to DB")
}).catch((err) => {
    console.log("err")
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


//Index route..
app.get("/listing",async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing })
})

//New Route..
app.get("/listing/new",(req,res) => {
    res.render("listing/new.ejs")
})


//Show route..
app.get("/listing/:id", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{ listing })
})

//Create Route..
app.post("/listing", async (req,res) => {
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    console.log(req.body)
    await newListing.save().then((res) => {
        console.log("succesful created");
    }).catch((err)=> {
        console.log(err)
    });
    res.redirect("/listing");
});

//edit route..
app.get("/listing/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{ listing })
});

//update Route..
app.put("/listing/:id", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
});

//Delete Route...
app.delete("/listing/:id",async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Listing which one is deleted is:",deletedListing)
    res.redirect("/listing")
});


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



app.listen(8080, () =>{
    console.log("server is listening to port 8080")
});