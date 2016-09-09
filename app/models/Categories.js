// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let categoriesSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  type: { type: String, required: true }
});

// Return model
module.exports = mongoose.model('Categories', categoriesSchema);
