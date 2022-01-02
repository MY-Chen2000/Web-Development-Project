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
    // for (let i = 0; i<50; i++){
    //     const sampleCity = randomElement(cities);
    //     const getPrice = Math.floor(Math.random()*20)+15;
    //     const camp=new campground({   
    //         author:'61cd0ca4eebddb952da4d3e6',   
    //         location:  `${sampleCity.city}, ${sampleCity.state}`,
    //         title: `${randomElement(descriptors)} ${randomElement(places)}`,
    //         //image: 'https://source.unsplash.com/collection/483251',
    //         price:getPrice,
    //         description:'This is a description',
    //         geometry: {
    //             type: "Point",
    //             coordinates: [
    //                 randomElement(cities).longitude,
    //                 randomElement(cities).latitude,
    //             ]
    //         },
    //         image: [
    //             {
    //                 url: 'https://res.cloudinary.com/db3sdq15t/image/upload/v1640978563/project/D7FB065B-6231-4F8F-9F4D-C17699BB3536_sw7hxg.jpg',
    //                 filename: 'project/D7FB065B-6231-4F8F-9F4D-C17699BB3536_sw7hxg'
    //             },
    //             {
    //                 url: 'https://res.cloudinary.com/db3sdq15t/image/upload/v1640978563/project/9148AFCF-1DE9-4412-BCED-E580FB437F5D_yvislo.jpg',
    //                 filename: 'project/9148AFCF-1DE9-4412-BCED-E580FB437F5D_yvislo'
    //             },
    //             {
    //                 url: 'https://res.cloudinary.com/db3sdq15t/image/upload/v1640978563/project/638FDE2B-88E2-417D-B808-052E0005B8B8_dpgfbl.jpg',
    //                 filename: 'project/638FDE2B-88E2-417D-B808-052E0005B8B8_dpgfbl'
    //             }
    //         ]

    //     });
    //     await camp.save();       
    // }
    console.log("saved");
}
seedDB().then(() => {
    mongoose.connection.close();
});
