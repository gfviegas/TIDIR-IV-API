let router = require('express').Router();
let jwt = require('express-jwt');

let Posts = require('../models/Posts');

/**
 * Get all posts
 */
router.get('/', (req, res) => {
  let sort = {sort: '-date'};
  if (req.query.sort) {
    sort = {sort: req.query.sort};
  }

  Posts
    .find({}, null, sort)
    .exec((err, posts) => {
      if (err) throw err;
      res.status(200).json(posts);
    });
});

/**
 * Get post by Id
 */
router.get('/:id', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();

  Posts
    .findById(req.params.id)
    .lean()
    .exec((err, post) => {
      if (err) throw err;
      res.status(200).json(post);
    });
});

/**
 * Edit Post
 */
router.put('/:id', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Posts.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, post) => {
      if (err) throw err;
      res.status(200).json(post);
    });
  }
});

/**
 * Delete Seller
 */
router.delete('/:id', (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Posts.findById(req.params.id).remove(err => {
      if (err) throw err;
      res.status(204).send();
    });
  }
});

module.exports = router;
