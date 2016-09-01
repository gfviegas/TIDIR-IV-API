// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  photo: { type: String, default: 'person.jpeg' },
  followedSellers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sellers'}],
  contact: {
    whatsapp: { type: String },
    facebook: { type: String },
    phone: { type: String }
  }
}, {
  timestamps: true
});

// Return model
module.exports = mongoose.model('Users', userSchema);
