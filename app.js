var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Canvas = require('./data/canvasData.js').Canvas;
var canvasMap = require('./data/canvasData.js').canvasMap;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
  	console.log(err);
    res.status(err.status || 500);
    res.render('error');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   console.log(err);
  res.status(err.status || 500);
  res.render('error');
});

io.on("connection", function(socket){
  socket.on("new_user", function (canvasData) {
    socket.emit("canvas_redraw", canvasMap[canvasData.name]);
  });

  socket.on("new_stroke", function (data) {
    canvasMap[data.canvasName].strokes.push(data.points);
    socket.broadcast.emit ("canvas_update", data.points);
  });
});

module.exports = {
  app: app,
  server: server
}
