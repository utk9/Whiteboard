var express = require('express');
var monsoose = require('mongoose');
var router = express.Router();
var Canvas = require('../data/canvasData.js').Canvas;
var canvasMap = require('../data/canvasData.js').canvasMap;
var CanvasInfo = require('../data/canvasData.js').CanvasInfo;

var Canvas = require('../models/Canvas.js');

//initiate mongoose connection
mongoose.connect('mongodb://localhost/Whiteboard');

var db = mongoose.connection;
db.on('error', function (err) {
	console.log(err);
});
db.on('open', function () {
	console.log("Connected to DB");
});

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

	if (db.canvases.find({'name': name}).limit(1).size()) {
		res.status(403).json({
			success: false,
			reason: "This name already exists."
		});
	} else {
		Canvas.create({
			name: name,
			password: pass,
			canvasInfo: {
				name: name,
				width: 900,
				height: 700,
				strokes: []
			}
		}, function (err, canvas) {
			if (err) {
				console.log(err);
			} else {
				//send over canvas as jsonc
			}
		});
		//canvasMap[name] = new Canvas(name, pass, new CanvasInfo(name, 700, 900, []));
		res.json({
			success: true,
			name: name
		});
	}
});

router.get('/api/canvas', function(req, res) {
	db.find(function (err, data) {
		if (err) {
			console.log(err);
			//send error to client
		} else {
			res.json(data);
		}
	});
	res.send();
});

router.get('/api/canvas/:name', function(req, res) {
	var name = req.params.name;
	db.canvases.findOne({'name': name}, function(err, canvas) {
		if (err) {
			console.log(err);
			//send error to client
		} else {
			if (canvas) {
				res.json(canvas);
			} else {
				res.status(404).json({
					reason: "This canvas does not exist"
				});
			}
		}
	});
});

//IO =========================================================


//whiteboard route
router.get('/:name', function(req, res) {
	var name = req.params.name;
	if (db.canvases.find({'name': name}).limit(1).size()) {
		res.render('whiteboard');
	} else {
		res.status(404).render('error');
	}


});



module.exports = router;
