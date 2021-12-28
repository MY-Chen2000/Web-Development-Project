const mongoose = require('mongoose');
const campground = require ('../models/campground');
mongoose.connect('mongodb://localhost:27017/camp')
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"),{
    useNewUrlParser:true
});
db.once('open',()=>{
    console.log("Connected")
});


const cities=require('./cities');
const {descriptors, places} = require('./helper');

const randomElement = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    console.log("deleted");
    for (let i = 0; i<50; i++){
        const sampleCity = randomElement(cities);
        const getPrice = Math.floor(Math.random()*20)+15;
        const camp=new campground({      
            location:  `${sampleCity.city}, ${sampleCity.state}`,
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price:getPrice,
            description:'This is a description'

        });
        await camp.save();       
    }
    console.log("saved");
}
seedDB().then(() => {
    mongoose.connection.close();
});
