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
            author:'61cd0ca4eebddb952da4d3e6',   
            location:  `${sampleCity.city}, ${sampleCity.state}`,
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            //image: 'https://source.unsplash.com/collection/483251',
            price:getPrice,
            description:'This is a description',
            image: [
                {
                    url: 'https://s36593.pcdn.co/wp-content/uploads/2020/02/Dogs-African-JEP_8748-480x320.jpg',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://s36593.pcdn.co/wp-content/uploads/2020/06/Addax-Male-JEP_6713-480x320.jpg',
                    filename: 'YelpCamp/ahfnenvca4tha00h2'
                },
                {
                    url: 'https://res.cloudinary.com/db3sdq15t/image/upload/v1640898152/samples/animals/reindeer.jpg',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]

        });
        await camp.save();       
    }
    console.log("saved");
}
seedDB().then(() => {
    mongoose.connection.close();
});
