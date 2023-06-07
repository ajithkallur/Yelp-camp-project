const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://ajithkallur:bhavyakallur@devconnector.4tns3.mongodb.net/');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const campGroundSchema = new mongoose.Schema({
    name: String
  });

  const Kitten = mongoose.model('Kitten', kittySchema);

  const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence
  
  
  const fluffy = new Kitten({ name: 'fluffy' });

fluffy.save();
silence.save()
const kittens =  Kitten.find();
console.log(kittens);
