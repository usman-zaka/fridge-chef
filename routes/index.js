var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// quick XSS test
router.post('/test-xss', function (req, res) {
  res.send({
    original: req.body.comment,
    sanitized: req.body.comment,
  });
});


module.exports = router;
