const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview,isLoggedIn } = require("../middleware.js");

const reviewController = require("../controller/review.js")


//Reviews
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route..
router.delete("/:reviewsId", wrapAsync(reviewController.deleteReview));

module.exports = router