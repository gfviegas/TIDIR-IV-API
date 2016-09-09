let mongoose = require('mongoose');
let seeder = require('mongoose-seeder');
let bcrypt = require('bcrypt');

let User = require('./app/models/Users');
let users = require('./seeders/users.json');

require('dotenv').config();

mongoose.connect(process.env.DB_HOST);

mongoose.connection.on('connected', () => {
  seedUsers();
});

let seedUsers = () => {
  seeder.seed(users).then(function (dbData) {
    // The database objects are stored in dbData
    console.log('Seeded Users.');
    process.exit(0);
  }).catch(function (err) {
    console.error('Error on seeding users, ', err);
    process.exit(0);
  });
};
