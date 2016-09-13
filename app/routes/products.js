let router = require('express').Router();
let Products = require('../models/Products');

/**
 * Get all products by a seller
 */
router.get('/', (req, res) => {
  Products
    .find()
    .populate('seller', '-updatedAt -createdAt -email -category -location -photo')
    .exec((err, products) => {
      if (err) throw err;
      res.status(200).json(products);
    });
});

/**
 * Get Category by Id
 */
router.get('/:id', (req, res) => {
  Products
    .findById(req.params.id)
    .populate('seller', '-updatedAt -createdAt -email -category -location')
    .exec((err, category) => {
      if (err) throw err;
      res.json(category);
    });
});

module.exports = router;
