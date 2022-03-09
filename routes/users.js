const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

router.get('/register', (req,res)=>{
    res.render('users/register')
})
router.post('/register', wrapAsync(async(req,res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser)
    req.flash('success','Welcome to Yelp Camp!')
    res.redirect('/campgrounds')
     }catch(e){
            req.flash('error', e.message);
            res.redirect('register')
     }
   
}))
module.exports = router;