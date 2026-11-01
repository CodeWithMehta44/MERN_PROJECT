const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");

//error handling 
const validateReview = (err,req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
            throw new expressError(400, error)
        }else{
            next();
        }
};


//Reviews
//Post Review Route
router.post("/", validateReview, wrapAsync(async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new review(req.body.review)
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

    res.redirect(`/listing/${listing._id}`)
}));

//Delete Review Route..
router.delete("/:reviewsId", 
    wrapAsync(async(req,res) => {
    let { id,reviewsId } = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewsId}})// (pulgitl-> delete) 
    await review.findByIdAndDelete(reviewsId);

    res.redirect(`/listing/${id}`)
}));

module.exports = router