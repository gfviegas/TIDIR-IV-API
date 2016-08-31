// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Return model
module.exports = mongoose.model('Users', userSchema);
