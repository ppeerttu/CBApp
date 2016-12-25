var authentication = function(req, res, next){
  // Checking whether user has authentication
  if (!req.session.userId || req.session.userId == null) {
      res.send(403);
  } else {
      next();
  }
}

module.exports = authentication;
