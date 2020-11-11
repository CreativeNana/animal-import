// Load dependencies
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Animal = require(`./models/animal.js`);

// Create express app
const app = express();
app.set('view engine','ejs')

// app.use is for using middleware
app.use(express.static(path.join(__dirname, 'public')));
console.log('here1');
app.use(express.urlencoded({ extended: true }));
console.log('here2');
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', function(error){
  console.log(`Connection Error: ${error.message}`)
});

db.once('open', function() {
  console.log('Connected to DB...');

});


// Individual Animal pages
/* app.get('/gallery/:id',function(request, response){
  response.send(`<img src="https://picsum.photos/id/${request.params.id}/750" alt="Lorem Picsum Image">`)
});

// JSON GET endpoint
app.get('/api/gallery', function(request, response){
  response.json(animals);
});
*/

app.get('/animals', function(request, response){
  Animal.find(function(err, animals) {
    console.log(animals);
    response.render('./pages/animals', {animals: animals})
  });
})

app.post('/animals', function(request, response) {
  const animal = new Animal(request.body);
  animal.save(function(error) {
    if (error) return response.status(500).send(error);
    return response.send(`<p>Thanks for the ${request.body.title}.</p>`);
  });
})


// Add more middleware
app.use(function(req, res, next) {
  res.status(404);
  res.send('404: File Not Found');
});

// Set port preferrence with default
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});