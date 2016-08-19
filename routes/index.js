var express = require('express');
var router = express.Router();
var Canvas = require('../data/canvasData.js').Canvas;
var canvasMap = require('../data/canvasData.js').canvasMap;
var CanvasInfo = require('../data/canvasData.js').CanvasInfo;

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

//API =========================================================
router.post('/api/canvas', function (req, res) {
	var name = req.body.name;
	var pass = req.body.pass ? req.body.pass : null;
	if (canvasMap.hasOwnProperty(name)) {
		res.status(403).json({
			success: false,
			reason: "This name already exists."
		});
	} else {
		canvasMap[name] = new Canvas(name, pass, new CanvasInfo(name, 700, 900, []));
		res.json({
			success: true,
			name: name
		});
	}
});

router.get('/api/canvas', function(req, res) {
	res.send(canvasMap);
});

router.get('/api/canvas/:name', function(req, res) {
	var name = req.params.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.json(canvasMap[req.params.name].canvasInfo);
	} else {
		res.status(404).json({
			reason: "This canvas does not exist"
		});
	}


});

//IO =========================================================


//whiteboard route
router.get('/:name', function(req, res) {
	var name = req.params.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.render('whiteboard');
	} else {
		res.status(404).render('error');
	}


});



module.exports = router;
