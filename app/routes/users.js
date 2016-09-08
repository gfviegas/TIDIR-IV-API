let router = require('express').Router();
let User = require('../models/Users');
let jwt = require('express-jwt');

/**
 * Check if there is an email registred
 */
router.get('/check/:email', (req, res) => {
  req.checkParams('email', 'invalid').notEmpty();
  User.findOne({
    email: req.params.email
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(200).json({ taken: false });
    } else {
      res.status(200).json({ taken: true });
    }
  });
});

/**
 * Get all users
 */
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.status(200).json(users);
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
    res.status(422).json(errors);
  } else {
    let newUser = new User(req.body);
    newUser.save(err => {
      if (err) throw err;

      res.status(201).json(newUser);
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
    res.status(422).json(errors);
  } else {
    User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, user) => {
      if (err) throw err;
      res.status(200).json(user);
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
    res.status(422).json(errors);
  } else {
    User.find({_id: req.params.id}).remove(err => {
      if (err) throw err;
      res.status(204).send();
    });
  }
});

module.exports = router;
