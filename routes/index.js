let express = require('express');
let router = express.Router();
let Canvas = require('../data/canvasData.js').Canvas;
let canvasMap = require('../data/canvasData.js').canvasMap;

//Routes ======================================================
router.get('/', function(req, res, next) {
  res.render('whiteboard'); //REMOVE!!
});

router.get('/create', function(req, res) {
	res.render('create');
});

router.get('/join', function(req, res) {
	res.render('join');
});

//API =========================================================
router.post('/api/canvas', function (req, res) {
	let name = req.body.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.status(403).json({
			success: false,
			reason: "This name already exists."
		});
	} else {
		canvasMap[name] = new Canvas(name, 900, 700, []);
		res.json({
			success: true,
			name: name
		});
	}
});

router.get('/api/canvas', function(req, res) {
	console.log(JSON.stringify(canvasMap));
	res.send(canvasMap);
});

router.get('/api/canvas/:name', function(req, res) {
	let name = req.params.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.json(canvasMap[req.params.name]);
	} else {
		res.status(404).json({
			reason: "This canvas does not exist"
		});
	}


});

//IO =========================================================


//whiteboard route
router.get('/:name', function(req, res) {
	let name = req.params.name;
	if (canvasMap.hasOwnProperty(name)) {
		res.render('whiteboard');
	} else {
		res.status(404).render('error');
	}


});



module.exports = router;
