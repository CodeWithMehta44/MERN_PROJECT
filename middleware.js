const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema} = require("./schema.js")
const {reviewSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js")

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be loggedIn to create Listing")
        return res.redirect("/login")
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
     let listing = await Listing.findById(id);
    //Owner Update
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "YOu are not the owner of this listing.");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async(req,res,next) => {
    let { id, reviewId} = req.params;
     let review = await Review.findById(reviewId);
    //Owner Update
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "YOu are not the author of this review.");
        return res.redirect(`/listing/${id}`);
    }

    next();
};


//error handling 
module.exports.validateListing = (err,req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMeg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, errMeg);
        }else{
            next();
        }
};


//error handling 
module.exports.validateReview = (err,req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
            throw new expressError(400, error)
        }else{
            next();
        }
};