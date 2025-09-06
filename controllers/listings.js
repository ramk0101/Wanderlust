const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPS_API_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { listings: allListings });
};

module.exports.newForm=(req, res) => {

  res.render('listings/new');
};

module.exports.show=async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate("owner");
  if (!listing) {
    // return next(new ExpressError('Listing not found', 404));
    req.flash('error', 'Listing not found');
   return res.redirect('/listings');
  }
  res.render('listings/show', { listing }); // ✅ Fixed path
};

module.exports.addNew=async (req, res) => {
  let response= await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();


  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry;
  let savedListing=await newListing.save();
  // console.log(savedListing);
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
};

module.exports.editListing=async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError('Listing not found', 404));
  }
  // let originalImageurl=listing.image.url;
  // originalImageurl.replace('upload/', 'upload/w_300,h_300/');
  res.render('listings/edit', { listing }); // ✅ Fixed path
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image.url = url;
    listing.image.filename = filename;
    await listing.save();
  }

  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};