const express = require('express');
const path = require('path');
const homeRouter = require('./routes/home.route');
const servicesRouter = require('./routes/services.route');
const contactRouter = require('./routes/contact.route');
const aboutRouter = require('./routes/about.route');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

// Configurations
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// routes
app.use('/home', homeRouter());
app.use('/services', servicesRouter());
app.use('/contact', contactRouter());
app.use('/about', aboutRouter());

// Wildcard routes
app.get('**', (req, res) => {
  res.redirect('/home');
});


app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});