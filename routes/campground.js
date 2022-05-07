const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

router.get("/", wrapAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground))

router.get('/:id',  wrapAsync(campgrounds.showCampground))

router.get('/:id/edit',  isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm)) 

router.put('/:id', isLoggedIn, isAuthor, validateCampground,  wrapAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn,isAuthor, wrapAsync(campgrounds.deleteCampground))

module.exports = router;