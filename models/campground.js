const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, //korzystamy w tym modelu ze schema review
            ref: 'Review' //tu podajemy model, z którego będziemy korzystać
        }
    ]
})

campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
        _id:{
            $in: doc.reviews
         }
    })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);