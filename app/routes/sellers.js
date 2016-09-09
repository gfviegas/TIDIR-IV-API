let router = require('express').Router();
let Seller = require('../models/Sellers');
let jwt = require('express-jwt');
let bcrypt = require('bcrypt');

/**
 * Check if there is an email registred
 */
router.get('/check/:email', (req, res) => {
  req.checkParams('email', 'invalid').notEmpty();
  Seller.findOne({
    email: req.params.email
  }, (err, seller) => {
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
  if (req.query) {
    Seller.find({name:  new RegExp(req.query.name, 'i')}, (err, sellers) => {
      if (err) throw err;
      res.status(200).json(sellers);
    });
  } else {
    Seller.find((err, sellers) => {
      if (err) throw err;
      res.status(200).json(sellers);
    });
  }
});

/**
 * Get seller by Id
 */
router.get('/:id', (req, res) => {
  Seller.findById(req.params.id, (err, seller) => {
    if (err) throw err;
    res.json(seller);
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
    bcrypt.hash(newSeller.password, 10, function(err, hash) {
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
