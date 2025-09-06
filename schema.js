const Joi = require('joi');
const listingschema=Joi.object(
    {
        listing: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.object({
                url: Joi.string().allow("",null),
            }).required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
            country: Joi.string().required()
        }).required()
    }
)
const reviewSchema = Joi.object({
    review: Joi.object({
        
        rating: Joi.number().required().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});
module.exports = {
listingschema,
reviewSchema
};