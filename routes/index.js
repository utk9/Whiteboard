var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

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

var returnRouter = function (io) {
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
	var pass = req.body.pass ? req.body.pass : null; // See post in create.html, might not be needed now
	var width = req.body.width;
	var height = req.body.height;

	Canvas.count({'name': name}, function (err, count) {
		if (count) {
			res.status(403).json({
				success: false,
				reason: "This name already exists."
			});
		} else {
			Canvas.create({
				name: name,
				pass: pass,
				canvasInfo: {
					name: name,
					width: width,
					height: height,
					strokes: []
				}
			}, function (err, canvas) {
				if (err) {
					console.log(err);
				} else {
          console.log(canvas);
					//send over canvas as jsonc
				}
			});
			res.json({
				success: true,
				name: name
			});
		}
	});
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
	Canvas.findOne({'name': name}, function(err, canvas) {
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
io.on("connection", function (socket) {
  socket.on("new_user", function (canvasData) {
    Canvas.findOne({name: canvasData.canvasInfo.name}, function (err, canvas){
      if (err) {
        console.log(err);
        //return error to user
      } else {
        if (canvas.pass) {
          if (canvasData.pass) {
            if (canvasData.pass == canvas.pass) {
              socket.join(canvasData.canvasInfo.name);
              socket.emit("canvas_redraw", canvas.canvasInfo);
            } else {
              socket.emit("incorrect_password");
            }
          } else {
            socket.emit("password_required");
          }
        } else {
          socket.join(canvasData.canvasInfo.name);
          socket.emit("canvas_redraw", canvas.canvasInfo);
        }

      }
    });
  });

  socket.on("new_stroke", function (data) {
    socket.broadcast.to(data.canvasName).emit("canvas_update", data);
    Canvas.update({name: data.canvasName}, { $push: {'canvasInfo.strokes': data.points}}, function (err){
      if (err) {
        console.log(err);
        //send error to client
      }
    });
  });
});


//whiteboard route
router.get('/:name', function(req, res) {
	var name = req.params.name;
	if (Canvas.find({'name': name}).limit(1).size()) {
		res.render('whiteboard');
	} else {
		res.status(404).render('error');
	}


});

return router;

}


module.exports = returnRouter;
