// Dependencies
let express = require('express');
let router = express.Router();
let jwtMiddleware = require('./middlewares/jwtMiddleware');


// router.use((err, req, res, next) => {
//   console.log(req);
//   // console.error(err.stack);
//   // res.status(500).send('Something broke!');
// });

// Routes
router.get('/', (req, res) => {
  res.send('api works!');
});

router.use('/auth', require('./routes/auth'));
router.use('/users', require('./routes/users'));
router.use('/sellers', require('./routes/sellers'));

// User.methods(['get', 'put', 'post', 'delete']);
// User.register(router, '/users');

// Return router
module.exports = router;
