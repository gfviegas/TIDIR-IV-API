// Dependencies
let mongoose = require('mongoose');

// Schema
let productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  images: {type: Array},
  price: {type: Number, required: true},
  favorite: {type: Boolean, default: false},
  stock_avaible: {type: Number, required: true, default: 0},
  stock_reserved: {type: Number, required: true, default: 0},
  category: {type: String},
  seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Sellers'}
});

// Return model
module.exports = mongoose.model('Products', productSchema);
