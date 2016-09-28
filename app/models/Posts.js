// Dependencies
// let restful = require('node-restful');
let mongoose = require('mongoose');

// Schema
let postsSchema = new mongoose.Schema({
  content: {type: String, required: true},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Sellers'}
}, {
  timestamps: true
});

// Return model
module.exports = mongoose.model('Posts', postsSchema);
