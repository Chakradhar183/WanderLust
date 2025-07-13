const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String, 
  country: String,
  reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  category:{
    type:String,
    default: "other"
  },
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in:listing.reviews}});
  }
    
});


listingSchema.pre("save", function (next) {
  if (this.country) {
    this.country = this.country
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  next();
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;