var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // This renders homepage
  res.render('index');
});

module.exports = router;
