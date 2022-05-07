const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
 const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')


router.get("/", wrapAsync(async(req,res)=>{
    const campgrounds = await Campground.find({}); //poczeka az znajdzie wszystkie campgroundy z bazy danych
    res.render('campgrounds/index', {campgrounds})
}))
router.get('/new', isLoggedIn, (req,res)=>{ //musi byc przed :id bo traktuje new jak id
    res.render('campgrounds/createcamp');
})
router.post('/', isLoggedIn, validateCampground, wrapAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully made a new campgrund!')
    res.redirect(`campgrounds/${campground.id}`)
}))
router.get('/:id/edit',  isLoggedIn, isAuthor, wrapAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
})) 
router.put('/:id', isLoggedIn, isAuthor, validateCampground,  wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground.id}`);
}))
router.get('/:id',  wrapAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate:{path: 'author'}}).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/showcamp', {campground})
}))
router.delete('/:id', isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You deleted campground!')
    res.redirect('/campgrounds')
}))



module.exports = router;