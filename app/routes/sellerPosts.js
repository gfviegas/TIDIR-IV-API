let router = require('express').Router();

let User = require('../models/Users');
let Posts = require('../models/Posts');

let expressJwt = require('express-jwt');
let jwt = require('jsonwebtoken');

/**
 * Get seller posts
 */
router.get('/:id/posts', (req, res) => {
  Posts
    .find({author: req.params.id})
    .exec((err, posts) => {
      if (err) throw err;
      res.status(200).json(posts);
    });
});

/**
 * Create a post
 */
router.post('/:id/posts', (req, res) => {
  req.assert('content', 'required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    let newPost = new Posts({content: req.body.content, author: req.params.id});

    newPost.save(err => {
      if (err) throw err;
      res.status(201).json(newPost);
    });
  }
});

module.exports = router;
