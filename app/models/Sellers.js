// Dependencies
let mongoose = require('mongoose');

// Schema
let sellerSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  photo: { type: String, default: 'person.jpeg' },
  contact: {
    whatsapp: { type: String },
    facebook: { type: String },
    phone: { type: String }
  }
}, {
  timestamps: true
});

// Return model
module.exports = mongoose.model('Sellers', sellerSchema);
