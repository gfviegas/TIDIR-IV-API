let mongoose = require('mongoose');
let seeder = require('mongoose-seeder');
let bcrypt = require('bcrypt');

let User = require('../app/models/Users');
let Sellers = require('../app/models/Sellers');
let Categories = require('../app/models/Categories');
let seedData = require('./seeder.json');

require('dotenv').config();

mongoose.connect(process.env.DB_HOST);

mongoose.connection.on('connected', () => {
  seedUsers();
});

let seedUsers = () => {
  seeder.seed(seedData).then(function (dbData) {
    // The database objects are stored in dbData
    console.log('Seeded.');
    process.exit(0);
  }).catch(function (err) {
    console.error('Error on seeding, ', err);
    process.exit(0);
  });
};
