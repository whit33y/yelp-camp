const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //boiler plate'y layouty itd 
const {campgroundSchema, reviewSchema} = require('./schemas.js') //destrukturyzacja validowych schematów campground i review
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require("./utils/ExpressError");
const session = require('express-session')
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');
const flash = require('connect-flash');
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // sprawdzanie połączenia z bazą danych 
db.once("open",()=>{
    console.log("Succesfuly connected to database");
});

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'this is secret and its bad',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//po 7 dnaich sie przedawnia
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// app.get('/fakeUser', async(req,res)=>{
//   const  user = new User({email: 'coltt@gmail.com', username: 'coltt'})
//   const newUser = await User.register(user, 'blahblah')
//   res.send(newUser)
// })

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get("/", (req,res)=>{
    res.render('home');
})



app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err,req,res,next)=>{
    if(!err.message) err.message = 'Oh no something went wrong!'
    const {statusCode = 500, message = 'Something went wrong'} = err
    res.status(statusCode).render('partials/errors', {err})
})
app.listen(3000, ()=>{
    console.log("Listening on port 3000")
})