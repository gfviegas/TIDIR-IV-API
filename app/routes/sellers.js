let router = require('express').Router();
let Seller = require('../models/Sellers');
let Products = require('../models/Products');
let User = require('../models/Users');
let expressJwt = require('express-jwt');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let extend = require('extend');
let multipart = require('connect-multiparty');
let fs = require('fs');
let jimp = require('jimp');

let getSellersList = (filters, sort, res) => {
  Seller
    .find(filters, null, sort)
    .exec((err, sellers) => {
      if (err) throw err;
      res.status(200).json(sellers);
    });
};

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
    if (req.query.location) {
      let location = JSON.parse(req.query.location);
      filters['location.state'] = location.state;
      filters['location.city'] = location.city;
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
        filters['_id'] = { $in: user.followedSellers };
        getSellersList(filters, sort, res);
      }
    });
  } else {
    getSellersList(filters, sort, res);
  }
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
      let category = req.query.category.replace(/[^\w\s]/gi, '');
      filters['category'] = new RegExp(category, 'i');
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
router.put('/:id', expressJwt({secret: process.env.APP_SECRET}), (req, res) => {
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
router.delete('/:id', expressJwt({secret: process.env.APP_SECRET}), (req, res) => {
  req.checkParams('id', 'invalid').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.status(422).json(errors);
  } else {
    Seller.find({_id: req.params.id}).remove(err => {
      if (err) throw err;

      User
        .update({followedSellers: req.params.id}, { $pull: {followedSellers: req.params.id} })
        .exec((err, user) => {
          if (err) throw err;
        });
      Products
        .remove({seller: req.params.id})
        .exec((err) => {
          if (err) throw err;
        });

      res.status(204).send();
    });
  }
});

/**
 * Changes seller image
 */
router.put('/:id/image', multipart(), (req, res) => {
  let file = req.files.file;
  let path = req.files.file.path;
  let localPath = process.cwd() + '/public/img/sellers/' + req.params.id;
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

    Seller
      .findById(req.params.id)
      .exec((err, user) => {
        if (err) throw err;
        user.photo = 'sellers/' + req.params.id + '/' + fileName;
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
