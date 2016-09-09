// Dependencies
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let cors = require('cors');

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });

require('dotenv').config();

// MongoDB
mongoose.connect(process.env.DB_HOST);

// Express
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(expressValidator());
app.use(express.static('public'));

// Routes
app.use('/api/v1', require('./app/routes'));

// Start server
app.listen(3000);
console.log('Listening on port 3000...');
