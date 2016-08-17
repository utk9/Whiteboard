var canvas = require('./domNodes').canvas;
var loadingOverlay = require('./domNodes').loadingOverlay;
var toolAttributes = require('./toolAttributes').attributes;
var selectedTool = require('./toolAttributes').selectedTool;
var marker = toolAttributes.marker;
var eraser = toolAttributes.eraser;

var canvasData = require('./canvasData.js').canvasData;

var drawing = false;
var prevPos = { x: 0, y: 0 }
var curPos = { x: 0, y: 0 }
var ctx = canvas.getContext('2d');

var socket = io();
socket.emit("new_user", canvasData);

socket.on("canvas_redraw", function (canvas) {
  console.log(canvas);
  loadingOverlay.classList.add("no-display");
});

socket.on("canvas_update", function(data) {
  console.log(data);
});

var draw = function(type, e) {

  if (type === 'down') {
    setCurrentPos(e);

    // Draw the first dot
    ctx.beginPath();
    ctx.fillStyle = marker.color;
    ctx.arc(curPos.x, curPos.y, marker.size/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    drawing = true;

  } else if (type === 'move') {
    if (drawing) {
      setPrevPos();
      setCurrentPos(e);
      stroke();
    }
  } else if (type === 'up' || type === 'out') {
    drawing = false;
  }

}

function setPrevPos() {
  prevPos.x = curPos.x;
  prevPos.y = curPos.y;
}

function setCurrentPos(e) {
  curPos.x = e.clientX - canvas.offsetLeft;
  curPos.y = e.clientY - canvas.offsetTop;
}

function stroke() {
  ctx.beginPath();

  if (selectedTool.name === 'marker') {
    ctx.lineWidth = marker.size;
    ctx.strokeStyle = marker.color;
  } else if (selectedTool.name === 'eraser') {
    ctx.lineWidth = eraser.size;
    ctx.strokeStyle = eraser.color;
  }

  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.moveTo(prevPos.x, prevPos.y);
  ctx.lineTo(curPos.x, curPos.y);

  debugger

  socket.emit("new_stroke", {
    toolAttribue: selectedTool.attributes,
    canvasName: canvasData.name,
    points: [prevPos, curPos]
  });

  ctx.stroke();
  ctx.closePath();
}

module.exports = draw
