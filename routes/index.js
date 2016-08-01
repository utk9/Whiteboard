var express = require('express');
var router = express.Router();

var canvasMap = new Object();

var Canvas = function (name) {
	this.name = name;
}

//Routes ======================================================
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/create', function(req, res) {
	res.render('create');
});

router.get('/join', function(req, res) {
	res.render('join');
});

router.post('/api/canvas', function (req, res) {
	var name = req.body.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.status(403).json({
			success: false,
			reason: "This name already exists."
		});
	} else {
		canvasMap[name] = new Canvas(name);
		res.json({
			success: true,
			name: name
		});
	}
});

//API =========================================================
router.get('/api/canvas', function(req, res) {
	console.log(JSON.stringify(canvasMap));
	res.send(canvasMap);
});

router.get('/api/canvas/:name', function(req, res) {
	res.json(canvasMap[req.params.name]);
});

//IO =========================================================


//whiteboard route
router.get('/:name', function(req, res) {
	var name = req.params.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.render('whiteBoard');
	} else {
		res.status(404).render('error');
	}

	
});



module.exports = router;
