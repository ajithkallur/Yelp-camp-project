var express = require('express');
var app = express();
const mongoose = require('mongoose');
const cities = require('./Seeds/cities');
const {places, descriptor} = require('./Seeds/seedhelpers')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://ajithkallur:bhavyakallur@devconnector.4tns3.mongodb.net/');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const campGroundSchema = new mongoose.Schema({
  title: String,
    price: String,
    description: String,
    location: String
});
app.listen(8080);
console.log('Server is listening on port 8080');
const sample = array=>array[Math.floor(Math.random() * array.length)];


const Campground = mongoose.model('Campgrounds', campGroundSchema);

// set the view engine to ejs
app.set('view engine', 'ejs');



const seedDB = async()=>{  
await Campground.deleteMany({});
  for(let i =0; i<50; i++){
    const random1000 = Math.floor(Math.random() +1000);
    const camp = new Campground({
      location: '${cities[random1000].city}, ${cities[random1000].state}',
      title:'${sample(descriptors)} ${sample(places)}'
    })
    await camp.save();
    
  }
  console.log('Campground refreshed');
  //res.send("Success");
 };

 seedDB();
// index page

 app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds',  async (req, res) => {
const campgrounds = await Campground.find({});
res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/:id', async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', {campground});
  })