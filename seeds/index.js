const mongoose = require('mongoose');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // sprawdzanie połączenia z bazą danych 
db.once("open",()=>{
    console.log("Succesfuly connected to database");
});

const sample = (array)=> array[Math.floor(Math.random()* array.length)];


const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*50)+10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/9046579',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, sint non facere neque asperiores fuga, quos quasi corrupti fugiat ab in veniam velit! Voluptate voluptatibus ipsa explicabo, cum esse ad.',
            price
        })
        await camp.save()
    }
    
}
seedDB().then(()=>{
    mongoose.connection.close();
})