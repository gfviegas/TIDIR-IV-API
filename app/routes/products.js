let router = require('express').Router();
let Categories = require('../models/Categories');

/**
 * Get all products by a seller
 */
router.get('/', (req, res) => {
  res.json({success: true});
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
