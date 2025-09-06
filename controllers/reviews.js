const Review=require('../models/review'); // ✅ Required import
const Listing=require('../models/listing');

// create review 
module.exports.createReview=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  
  listing.reviews.push(newReview);
  await newReview.save();
  req.flash('success', 'Review added successfully!');
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}

// delete review 

module.exports.deleteReview=async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully!');
  res.redirect(`/listings/${id}`);
}