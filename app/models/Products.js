// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  images: Array,
  price: {type: Number, required: true},
  qualityId: { type: Number, required: true }
});

// Return model
module.exports = mongoose.model('Products', productSchema);
