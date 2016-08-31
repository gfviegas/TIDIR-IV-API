let router = require('express').Router();
let User = require('../models/Users');
let jwt = require('express-jwt');

/**
 * Get all users
 */
router.get('/', jwt({secret: process.env.APP_SECRET}), (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

/**
 * Get user by Id
 */
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) throw err;
    res.json(user);
  });
});

/**
 * Create new User
 */
router.post('/', (req, res) => {
  req.assert('name', 'required').notEmpty();
  req.assert('password', 'required').notEmpty();
  req.assert('email', 'required').notEmpty();
  req.assert('email', 'email').isEmail();
  let errors = req.validationErrors();

  if (errors) {
    res.json(errors, 422);
  } else {
    let newUser = new User(req.body);
    newUser.save(err => {
      if (err) throw err;
      res.json(newUser, 201);
    });
  }
});

/**
 * Edit User
 */
router.put('/:id', jwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.json(errors, 422);
  } else {
    User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, user) => {
      if (err) throw err;
      res.json(user, 200);
    });
  }
});

/**
 * Delete User
 */
router.delete('/:id', jwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.json(errors, 422);
  } else {
    User.find({_id: req.params.id}).remove(err => {
      if (err) throw err;
      res.status(204).send();
    });
  }
});

module.exports = router;
