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
router.use('/users', require('./routes/followers'));

router.use('/categories', require('./routes/categories'));

router.use('/sellers', require('./routes/sellers'));
router.use('/sellers', require('./routes/sellerPosts'));

router.use('/posts', require('./routes/posts'));

router.use('/products', require('./routes/products'));

// Return router
module.exports = router;
