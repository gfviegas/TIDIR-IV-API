let router = require('express').Router();
let Seller = require('../models/Sellers');
let Products = require('../models/Products');
let jwt = require('express-jwt');
let bcrypt = require('bcrypt');
let extend = require('extend');

/**
 * Check if there is an email registred
 */
router.get('/check/:email', (req, res) => {
  req.checkParams('email', 'invalid').notEmpty();
  Seller
    .findOne({
      email: req.params.email
    })
    .exec((err, seller) => {
      if (err) throw err;

      if (!seller) {
        res.status(200).json({ taken: false });
      } else {
        res.status(200).json({ taken: true });
      }
    });
});

/**
 * Get all sellers
 */
router.get('/', (req, res) => {
  let filters = {};
  let sort = {sort: 'date'};

  if (req.query) {
    if (req.query.name) {
      filters['name'] = new RegExp(req.query.name, 'i');
    }
    if (req.query.category) {
      filters['category'] = new RegExp(req.query.category, 'i');
    }
    if (req.query.onlyFollowedSellers) {
      /**
       * TODO: Logica pra so pegar seguidores
       */
    }
    if (req.query.sort) {
      sort = {sort: req.query.sort};
    }
  }

  Seller
    .find(filters, null, sort)
    .exec((err, sellers) => {
      if (err) throw err;
      res.status(200).json(sellers);
    });
});

/**
 * Get seller by Id
 */
router.get('/:id', (req, res) => {
  Seller
    .findById(req.params.id)
    .lean()
    .exec((err, seller) => {
      if (err) throw err;
      Products
        .count({seller: seller._id})
        .exec((error, countProducts) => {
          if (error) throw error;
          let sellerModified = extend(true, seller, {'products': countProducts});
          console.log(sellerModified);
          res.json(sellerModified);
        });
    });
});

/**
 * Get products by a seller
 */
router.get('/:id/products', (req, res) => {
  let filters = {seller: req.params.id};
  let sort = {sort: 'date'};

  if (req.query) {
    if (req.query.name) {
      filters['name'] = new RegExp(req.query.name, 'i');
    }
    if (req.query.category) {
      filters['category'] = new RegExp(req.query.category, 'i');
    }
    if (req.query.onlyInStock) {
      filters['stock_avaible'] = { $gt: 0 };
    }
    if (req.query.sort) {
      sort = {sort: req.query.sort};
    }
  }

  Products
    .find(filters, null, sort)
    .populate('seller', '-updatedAt -createdAt -email -category')
    .exec((err, products) => {
      if (err) throw err;
      res.status(200).json(products);
    });
});

/**
 * Create new Seller
 */
router.post('/', (req, res) => {
  req.assert('name', 'required').notEmpty();
  req.assert('password', 'required').notEmpty();
  req.assert('email', 'required').notEmpty();
  req.assert('email', 'email').isEmail();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    let newSeller = new Seller(req.body);
    console.info(newSeller);
    bcrypt.hash(newSeller.password, 10, function (err, hash) {
      if (err) throw err;
      newSeller.password = hash;
      newSeller.save(err => {
        if (err) throw err;
        res.status(201).json(newSeller);
      });
    });
  }
});

/**
 * Edit Seller
 */
router.put('/:id', jwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Seller.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, seller) => {
      if (err) throw err;
      res.status(200).json(seller);
    });
  }
});

/**
 * Delete Seller
 */
router.delete('/:id', jwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Seller.find({_id: req.params.id}).remove(err => {
      if (err) throw err;
      res.status(204).send();
    });
  }
});

module.exports = router;
