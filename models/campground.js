const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    image1: String,
    price: Number,
    description: String,
    location: String
})

module.exports = mongoose.model('Campground' , CampGroundSchema)