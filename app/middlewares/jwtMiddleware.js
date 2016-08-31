function jwtMiddleware (err, req, res, next) {
  console.log(err);
  if (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'token_expired'});
    } else {
      return res.status(401).json({error: 'invalid_token'});
    }
  }
}

module.exports = jwtMiddleware;
