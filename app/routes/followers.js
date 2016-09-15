let router = require('express').Router();
let ObjectId = require('mongoose').Schema.Types.ObjectId;

let User = require('../models/Users');

let expressJwt = require('express-jwt');
let jwt = require('jsonwebtoken');

/**
 * Get user followed sellers
 */
router.get('/:id/followers', (req, res) => {
  User
    .findById(req.params.id)
    .populate('followedSellers')
    .exec((err, user) => {
      if (err) throw err;
      res.status(200).json(user.followedSellers);
    });
});

/**
 * Add a seller to a user following list
 */
router.post('/:id/followers', (req, res) => {
  req.assert('seller', 'required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    User
      .findOneAndUpdate({_id: req.params.id}, {$addToSet: {followedSellers: req.body.seller}}, {new: true})
      .exec((err, user) => {
        if (err) throw err;
        res.status(200).json(user.followedSellers);
      });
  }
});

/**
 * Delete User
 */
router.delete('/:id/followers/:sellerid', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  req.checkParams('sellerid', 'required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    User
      .findOneAndUpdate({_id: req.params.id}, { $pull: {followedSellers: req.params.sellerid} }, {new: true})
      .exec((err, user) => {
        if (err) throw err;
        res.status(200).json(user.followedSellers);
      });
  }
});

module.exports = router;
