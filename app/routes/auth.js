let router = require('express').Router();
let User = require('../models/Users');
let Seller = require('../models/Sellers');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');

router.post('/user', (req, res) => {
  User
    .findOne({ email: req.body.email })
    .select('+password')
    .exec((err, user) => {
      if (err) throw err;

      if (!user) {
        res.status(422).json({ error: 'user_not_found' });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, success) => {
          if (err) throw err;

          if (!success) {
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
              expiresIn: '30d',
              issuer: 'TIDIR APP'
            };
            let token = jwt.sign(payload, process.env.APP_SECRET, options);
            res.status(200).json({token: token});
          }
        });
      }
    });
});

router.post('/seller', (req, res) => {
  Seller
    .findOne({ email: req.body.email })
    .select('+password')
    .exec((err, user) => {
      if (err) throw err;

      if (!user) {
        res.status(422).json({ error: 'user_not_found' });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, success) => {
          if (err) throw err;

          if (!success) {
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
              expiresIn: '30d',
              issuer: 'TIDIR APP'
            };
            let token = jwt.sign(payload, process.env.APP_SECRET, options);
            res.status(200).json({token: token});
          }
        });
      }
    });
});

module.exports = router;
