const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.addReview=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("sucess","new review created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
     req.flash("sucess"," review deleted ");
    res.redirect(`/listings/${id}`);
};