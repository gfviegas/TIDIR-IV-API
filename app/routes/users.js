let router = require('express').Router();

let User = require('../models/Users');
let Sellers = require('../models/Sellers');
let Products = require('../models/Products');

let jimp = require('jimp');
let expressJwt = require('express-jwt');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let multipart = require('connect-multiparty');
let fs = require('fs');

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
    console.info(newUser);
    bcrypt.hash(newUser.password, 10, function (err, hash) {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(err => {
        if (err) throw err;
        res.status(201).json(newUser);
      });
    });
  }
});

/**
 * Edit User
 */
router.put('/:id', expressJwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, user) => {
      if (err) throw err;
      res.status(200).json(user);
    });
  }
});

/**
 * Delete User
 */
router.delete('/:id', expressJwt({secret: process.env.APP_SECRET}), (req, res) => {
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

/**
 * Changes user image
 */
router.put('/:id/image', multipart(), (req, res) => {
  let file = req.files.file;
  let path = req.files.file.path;
  let localPath = process.cwd() + '/public/img/users/' + req.params.id;
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath);
  }

  let fileName;
  if (file.type === 'image/jpeg' || 'image/jpg') {
    fileName = 'profile.jpg';
  } else if (file.type === 'image/png') {
    fileName = 'profile.png';
  } else {
    return res.status(422).json({format: 'invalid_format'});
  }

  let newFile = localPath + '/' + fileName;
  fs.rename(path, newFile, (err) => {
    if (err) {
      res.status(500).json({error: err});
    }

    User
      .findById(req.params.id)
      .exec((err, user) => {
        if (err) throw err;
        user.photo = 'users/' + req.params.id + '/' + fileName;
        user.save();

        res.status(200).json(user);
      });

    jimp.read(newFile).then(function (image) {
      image.resize(200, 200)
      .quality(60)
      .write(newFile);
    }).catch(function (err) {
      console.error(err);
    });

  });
});

 module.exports = router;
