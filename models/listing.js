const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;   


const listingSchema=new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
  image: {
   
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
   geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
     
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }

});

const Listing=mongoose.model('Listing',listingSchema);
module.exports = Listing;
