let router = require('express').Router();
let Products = require('../models/Products');
let jwt = require('jsonwebtoken');
let User = require('../models/Users');

let getProductsList = (filters, popFilters, sort, res) => {
  Products
  .find(filters, null, sort)
  .populate({
    path: 'seller',
    match: popFilters,
    // select: '-updatedAt -createdAt -email -category',
    model: 'Sellers'
  })
  .exec((err, products) => {
    if (err) throw err;

    products = products.filter((p) => p.seller);
    res.status(200).json(products);
  });
};

/**
 * Get all products
 */
router.get('/', (req, res) => {
  let filters = {};
  let popFilters = {};
  let sort = {sort: '-createdAt'};

  if (req.query) {
    if (req.query.name) {
      filters['name'] = new RegExp(req.query.name, 'i');
    }
    if (req.query.category) {
      filters['category'] = new RegExp(req.query.category, 'i');
    }
    if (req.query.location) {
      let location = JSON.parse(req.query.location);
      popFilters['location.state'] = location.state;
      popFilters['location.city'] = location.city;
    }
    if (req.query.onlyInStock) {
      filters['stock_avaible'] = { $gt: 0 };
    }
    if (req.query.sort) {
      sort = {sort: req.query.sort};
    }
  }

  if (req.query.onlyFollowedSellers) {
    let user = jwt.decode(req.headers.authorization.split(' ')[1]);
    User
    .findById(user.sub)
    .exec((error, user) => {
      if (error) throw error;
      if (user) {
        // filters['seller'] = {$in: user.followedSellers};
        // popFilters['_id'] = {$in: user.followedSellers};
        getProductsList(filters, popFilters, sort, res);
      }
    });
  } else {
    getProductsList(filters, sort, res);
  }
});

/**
 * Get Category by Id
 */
router.get('/:id', (req, res) => {
  Products
    .findById(req.params.id)
    .populate('seller', '-updatedAt -createdAt -email -category')
    .exec((err, category) => {
      if (err) throw err;
      res.json(category);
    });
});

/**
* Create new Product
*/
router.post('/', (req, res) => {
  req.assert('name', 'required').notEmpty();
  req.assert('description', 'required').notEmpty();
  req.assert('category', 'required').notEmpty();
  req.assert('stock_avaible', 'required').notEmpty();
  req.assert('stock_reserved', 'required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    let seller = jwt.decode(req.headers.authorization.split(' ')[1]);
    let newProduct = new Products(req.body);
    newProduct.seller = seller.sub;
    console.log(newProduct);
    newProduct.save(err => {
      if (err) throw err;
      res.status(201).json(newProduct);
    });
  }
});

/**
 * Edit Product
 */
router.put('/:id', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Products
    .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, product) => {
      if (err) throw err;
      res.status(200).json(product);
    });
  }
});

/**
 * Delete Product
 */
router.delete('/:id', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Products.findById(req.params.id).remove(err => {
      if (err) throw err;
      res.status(204).send();
    });
  }
});

module.exports = router;
