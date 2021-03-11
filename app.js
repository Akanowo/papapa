const express = require('express');
const path = require('path');
const homeRouter = require('./routes/home.route');

const PORT = 8080 || process.env.PORT;

const app = express();

// Configurations
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// routes
app.use('/', homeRouter());

// Wildcard routes
app.get('**', (req, res) => {
  res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});