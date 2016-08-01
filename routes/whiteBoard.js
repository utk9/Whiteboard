var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('whiteboard', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
	res.send("test route");
});

module.exports = router;
