const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const Listing = require('../models/listing');
const Review = require('../models/review'); 
const{validateReview, isLoggedIn}=require('../middleware');
const { isReviewAuthor } = require('../middleware');
const reviewController=require('../controllers/reviews');




// Reviews - create a new review
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;