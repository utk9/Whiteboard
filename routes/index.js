var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', function(req, res) {
	res.render('create');
});

router.get('/join', function(req, res) {
	res.render('join');
});

router.get('/:id', function(req, res) {
	var id = req.param.id;
	console.log(id);
	res.render('whiteBoard');
})

module.exports = router;
