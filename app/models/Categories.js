// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let categoriesSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  subcategories: [{type: String}]
});

// Return model
module.exports = mongoose.model('Categories', categoriesSchema);
