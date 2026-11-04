const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, isReviewAuthor} = require("../middleware.js");

const listingController = require("../controller/listing.js")
const multer = require("multer"); // helps to store file in backend...
const {storage} = require("../cloudConfig.js")

const upload = multer({ storage})

router
    .route("/")
    ///Index route..
    .get((listingController.index))
    //Create Route..
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));

//New Route..
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Show route..
router.get("/:id", wrapAsync(listingController.showListing));

//edit route..
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

//update Route..
router.put("/:id", validateListing, isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing));

//Delete Route...
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;