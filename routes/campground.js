const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js') //destrukturyzacja validowych schematów campground i review


const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 404)
    }else{
    next()
    }
}


router.get("/", wrapAsync(async(req,res)=>{
    const campgrounds = await Campground.find({}); //poczeka az znajdzie wszystkie campgroundy z bazy danych
    res.render('campgrounds/index', {campgrounds})
}))
router.get('/new', (req,res)=>{ //musi byc przed :id bo traktuje new jak id
    res.render('campgrounds/createcamp');
})
router.post('/', validateCampground, wrapAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Succesfully made a new campgrund!')
    res.redirect(`campgrounds/${campground.id}`)
}))
router.get('/:id/edit', wrapAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
})) 
router.put('/:id', validateCampground,  wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`);
}))
router.get('/:id', wrapAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/showcamp', {campground})
}))
router.delete('/:id', wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

module.exports = router;