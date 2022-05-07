const express = require('express')
const router = express.Router({mergeParams: true}); //merge params pobiera wszystkie parametry z tego pliku app.js
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground")
const {reviewSchema} = require('../schemas.js')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/',  isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router