const express = require("express");
const router=express.Router();

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner}=require("../middleware.js");

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


const validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};

const ListingController=require("../controllers/listing.js");

// Index Route 
router.get("/", wrapAsync(ListingController.index));

//category
router.get("/category/:category", wrapAsync(ListingController.filterByCategory));


// Search Route 
router.get("/country", wrapAsync(ListingController.searchListing));

// New Route 
router.get("/new", isLoggedin, ListingController.new);

// Edit Route 
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(ListingController.editListing));

// Update Route 
router.put("/:id", isLoggedin, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(ListingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(ListingController.deleteListing));

// Create Route 
router.post("/", isLoggedin, validateListing, upload.single("listing[image]"), wrapAsync(ListingController.createListing));

// Show Route
router.get("/:id", wrapAsync(ListingController.showListing));

module.exports=router;
