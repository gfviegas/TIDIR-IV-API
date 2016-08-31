let router = require('express').Router();
let User = require('../models/Users');
let Seller = require('../models/Sellers');
let jwt = require('jsonwebtoken');

router.post('/user', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(422).json({ error: 'user_not_found' });
    } else {
      if (user.password !== req.body.password) {
        res.status(422).json({ error: 'wrong_credentials' });
      } else {
        delete user.password;
        user.type = 'user';
        let payload = {
          user_data: {
            name: user.name
          },
          sub: user.id
        };
        let options = {
          expiresIn: '15m',
          issuer: 'TIDIR APP'
        };
        let token = jwt.sign(payload, process.env.APP_SECRET, options);
        res.status(200).json({token: token});
      }
    }
  });
});

router.post('/seller', (req, res) => {
  Seller.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(422).json({ error: 'user_not_found' });
    } else {
      if (user.password !== req.body.password) {
        res.status(422).json({ error: 'wrong_credentials' });
      } else {
        delete user.password;
        user.type = 'seller';
        let payload = {
          user_data: {
            name: user.name
          },
          sub: user.id
        };
        let options = {
          expiresIn: '15m',
          issuer: 'TIDIR APP'
        };
        let token = jwt.sign(payload, process.env.APP_SECRET, options);
        res.status(200).json({token: token});
      }
    }
  });
});

module.exports = router;
