const Listing=require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { listingschema } = require('./schema');
const {  reviewSchema } = require('./schema');
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL
    req.flash('error', 'You must be logged in to create a new listing');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } else {
    res.locals.redirectUrl = "/listings"; // fallback
  }
  next();
};


module.exports.isOwner =async (req, res, next) => {
    const { id } = req.params;
let listing= await Listing.findByIdAndUpdate(id);
if(! listing.owner._id.equals(res.locals.currUser._id)) {
  req.flash('error', 'You do not have permission to do that!');
return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(', ');
    return next(new ExpressError(errmsg, 400));
  }
  next();
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(', ');
    return next(new ExpressError(errmsg, 400));
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};
