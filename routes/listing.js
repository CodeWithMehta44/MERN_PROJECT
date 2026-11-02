const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema} = require("../schema.js")
const expressError = require("../utils/expressError.js")
const Listing = require("../models/listing.js");

//error handling 
const validateListing = (err,req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMeg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, errMeg);
        }else{
            next();
        }
}


//Index route..
router.get("/",
    wrapAsync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing })
}))

//New Route..
router.get("/new",(req,res) => {
    res.render("listing/new.ejs")
})


//Show route..
router.get("/:id", 
    wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing u requted does't exit")
        return res.redirect("/listing");
    }
    res.render("listing/show.ejs",{ listing })
}))

//Create Route..
router.post("/", validateListing,
    wrapAsync(async (req,res,next) => {
        // let {title, description, image, price, location, country} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save()
        req.flash("success", "New Listing Created!!")
        res.redirect("/listing");
    }));

//edit route..
router.get("/:id/edit", 
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{ listing })
}));

//update Route..
router.put("/:id", validateListing,
    wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!!")
    res.redirect(`/listing/${id}`);
}));

//Delete Route...
router.delete("/:id",
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Listing which one is deleted is:",deletedListing)
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listing")
}));

module.exports = router;