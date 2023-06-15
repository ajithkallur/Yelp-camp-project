var express = require('express');
var app = express();
const path = require('path')
const mongoose = require('mongoose');
const cities = require('./Seeds/cities');
const {places, descriptor} = require('./Seeds/seedhelpers')
const methodOverride = require('method-override')
var __dirname ="C:\Users\aajithkumarreddy\Desktop\Desktop\Personal\Full Stack\Yelp\Yelp camp project\views";
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

//app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


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

app.post('/campgrounds',  async (req, res) => {
  const campground1 = new Campground(req.body.campground)
  await campground1.save();
  //res.send("Succ save");
   res.redirect('/campgrounds')
    });
    

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', {campground});
  })
  app.post('/campgrounds/:id/edit',  async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect('/campgrounds');
      });

app.get('/campgrounds/:id/edit', async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
}); 


app.post('/campgrounds/:id/delete', async(req, res) => {
  const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}); 
