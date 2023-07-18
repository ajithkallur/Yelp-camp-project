var express = require('express');
var app = express();
const path = require('path')
const mongoose = require('mongoose');
const cities = require('./Seeds/cities');
const {places, descriptors} = require('./Seeds/seedhelpers')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const Schema = mongoose.Schema
const catchAsync = require("./Utils/catchAsync");
const ExpressError = require('./Utils/ExpressError');
const Review = require('./models/reviews')
 
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
    location: String,
    reviews:[

      { 
        type: Schema.Types.ObjectId,
        ref: 'Review'

      }
    ]
});
app.listen(8080);
console.log('Server is listening on port 8080');
const sample = array=>array[Math.floor(Math.random() * array.length)];


const Campground = mongoose.model('Campgrounds', campGroundSchema);

//app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');

//use ejs-mate engine for ejs
app.engine('ejs',ejsMate)
//used to send ID or any thing in URL
app.use(express.urlencoded({extended: true}))
//used to use put or delete methods in Forms
//app.use(methodOverride('_method'))
//used for logging
app.use(morgan('common'))

//next and return next

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
     // const img = new Image(100, 200); // width, height
      // img.src = "https://picsum.photos/200/301"
      const camp = new Campground({
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          image: "https://picsum.photos/200/301",
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
          price
      })
      
      await camp.save();
  }


  console.log('Campground refreshed');
  //res.send("Success");
 }

 seedDB();
// index page

const validateCampground = (req,res,next) =>{
 //server side validation with joi
 const campgroundSchema = Joi.object({
  campground:Joi.object({
     title: Joi.string().required(),
     location: Joi.string().required(),
     price: Joi.number().required().min(0)
  }).required()
  })
  
  

  const {error} = campgroundSchema.validate(req.body)
   if (error){
    const msg = error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else{
    next()
  }
}

const validateReview = (req,res,next) =>{
  //server side validation with joi
  const reviewSchema = Joi.object({
   review:Joi.object({
      body: Joi.string().required(),
      rating: Joi.number().required().min(1).max(5)
   }).required()
   })
   const {error} = reviewSchema.validate(req.body)
    if (error){
     const msg = error.details.map(el=>el.message).join(',')
     throw new ExpressError(msg,400)
   }
   else{
     next()
   }
 }
 app.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds',  async (req, res) => {
const campgrounds = await Campground.find({});
res.render('campgrounds/index', {campgrounds});
})

app.post('/campgrounds',  validateCampground,catchAsync(async (req, res,next) => {
  //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

 
  const campground1 = new Campground(req.body.campground)
  await campground1.save();
  //res.send("Succ save");
   res.redirect('/campgrounds')
  
    }));
    

    app.post('/campgrounds/:id/reviews',  catchAsync(async (req, res,next) => {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      res.send('success');
    }))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', {campground});
  }))
  app.post('/campgrounds/:id/edit',  async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect('/campgrounds');
      });

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})); 


app.post('/campgrounds/:id/delete', catchAsync(async(req, res) => {
  const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
})); 

//this invokes for any route which is not present
//send 404 for any other request
app.all('*', (req,res,next) =>{
next(new ExpressError('Page Not Found',404))
})


app.use((err,req,res,next) => {
//destructure error
const {statusCode =500} = err;
if(!err.message){
  err.message ="Something went wrong"
}
res.status(statusCode).render('error',{err});
})

