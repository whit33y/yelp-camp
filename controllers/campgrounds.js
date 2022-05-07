const Campground = require('../models/campground');

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({}); //poczeka az znajdzie wszystkie campgroundy z bazy danych
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res)=>{ //musi byc przed :id bo traktuje new jak id
    res.render('campgrounds/createcamp');
}

module.exports.createCampground = async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully made a new campgrund!')
    res.redirect(`campgrounds/${campground.id}`)
}

module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate:{path: 'author'}}).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/showcamp', {campground})
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.editCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You deleted campground!')
    res.redirect('/campgrounds')
}
