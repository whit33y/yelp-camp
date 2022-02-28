const mongoose = require('mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(passportLocalMongoose); //doda username i password a nawet bedzie utrzymywal to zeby usernamesy byly unikatowe

module.exports= mongoose.model('User', userSchema)