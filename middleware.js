const {campgroundSchema} = require('./schemas.js') //destrukturyzacja validowych schematów campground i review
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const {reviewSchema} = require('./schemas.js')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
    //store the url they are requesting!
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in')
    return res.redirect('/login')
}
next()
}
module.exports.validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 404)
    }else{
    next()
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 404)
    }else{
        next()
    }
}