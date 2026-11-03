const Listing = require("../models/listing");
const review = require("../models/review")

module.exports.createReview = async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new review(req.body.review)
   newReview.author = req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
    req.flash("success", "New review has added!!")
    res.redirect(`/listing/${listing._id}`)
};

module.exports.deleteReview = async(req,res) => {
    let { id,reviewsId } = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewsId}})// (pulgitl-> delete) 
    await review.findByIdAndDelete(reviewsId);
    req.flash("success", "Review deleted!!")
    res.redirect(`/listing/${id}`)
};

