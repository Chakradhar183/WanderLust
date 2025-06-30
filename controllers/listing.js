const { fi } = require("@faker-js/faker");
const Listing=require("../models/listing.js");

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.new=(req, res) => {
  
  res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner");
  if(!listing){
     req.flash("error","listing doesnot exist");
     res.redirect("/listings")
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing=async (req, res) => {
   let url=req.file.path;
   let filename=req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("sucess","new listing created");
  res.redirect("/listings");
};


module.exports.editListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","listing doesnot exist");
     res.redirect("/listings")
  }
  let originalImageUrl=listing.image.url;
 originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
  
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing=async (req, res) => {
  const { id } = req.params;
 let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file!=="undefined"){
    let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
   }
   
   req.flash("sucess"," listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("sucess"," listing deleted");
  res.redirect("/listings");
};

module.exports.searchListing = async (req, res) => {
  const { country } = req.query;

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const query = {};
  if (country && country.trim() !== "") {
    const formattedCountry = toTitleCase(country.trim());
    query.country = formattedCountry;
  }

  try {
    const allListings = await Listing.find(query);
    res.render("listings/index", { allListings, country: req.query.country });

  } catch (err) {
    console.error(err);
    res.redirect("/listings");
  }
};

module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("listings/index", { allListings });
};

