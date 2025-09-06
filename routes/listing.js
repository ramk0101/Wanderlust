
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const Listing = require('../models/listing');
const Review = require('../models/review'); // ✅ Required import
const {isLoggedIn,validateListing} = require('../middleware');
 // ✅ Import the middleware
 const { isOwner } = require('../middleware'); // ✅ Import the isOwner middleware
// Middleware to validate listing data
const listingController=require('../controllers/listings');
const multer  = require('multer');
const{storage}=require('../cloudConfig');
const upload = multer({storage: storage });




// Index - list all listings
router.route('/')
.get( wrapAsync(listingController.index))
.post(isLoggedIn,validateListing, upload.single('listing[image][url]'), wrapAsync(listingController.addNew));

  




// New - form to create listing
router.get('/new', isLoggedIn, listingController.newForm);




// Show ,Update and delete route 

router.route('/:id')
.get( wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,validateListing,upload.single('listing[image][url]'),  wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.editListing));



module.exports = router;
