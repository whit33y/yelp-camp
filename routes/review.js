const express = require('express')
const router = express.Router({mergeParams: true}); //merge params pobiera wszystkie parametry z tego pliku app.js

 const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Campground = require("../models/campground")

const {reviewSchema} = require('../schemas.js')
const {validateReview} = require('../middleware')



router.post('/',validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:reviewId', wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router