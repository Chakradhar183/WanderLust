const express = require("express");
const router=express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewschema } = require("../schema.js");
const {isLoggedin,isReviewAuthor}=require("../middleware.js");

const ReviewController=require("../controllers/review.js");

const validateReview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};


// Add Review
router.post("/",isLoggedin,validateReview, wrapAsync(ReviewController.addReview));

//delete review
router.delete("/:reviewid",isLoggedin,isReviewAuthor,wrapAsync(ReviewController.deleteReview));

module.exports=router;