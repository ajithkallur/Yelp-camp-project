
const mongoose = require('mongoose');
//const Campground = require('./models/campground')
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


const Campground = mongoose.model('Campgrou1', campGroundSchema);

 Campground.deleteMany();
const c = new Campground({title: 'Purple field'})
 c.save()

