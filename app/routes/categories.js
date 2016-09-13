let router = require('express').Router();
let Categories = require('../models/Categories');
let jwt = require('express-jwt');
let bcrypt = require('bcrypt');

/**
 * Get all categories
 */
router.get('/', (req, res) => {
  Categories.find((err, categories) => {
    if (err) throw err;
    res.status(200).json(categories);
  });
});

/**
 * Get Category by Id
 */
router.get('/:id', (req, res) => {
  Categories.findById(req.params.id, (err, category) => {
    if (err) throw err;
    res.json(category);
  });
});

module.exports = router;
