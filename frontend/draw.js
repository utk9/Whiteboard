var canvas = require('./domNodes').canvas;
var toolAttributes = require('./toolAttributes').attributes
var marker = toolAttributes.marker

var drawing = false;
var prevPos = { x: 0, y: 0 }
var curPos = { x: 0, y: 0 }
var ctx = canvas.getContext('2d');

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

  ctx.lineWidth = marker.size;
  ctx.strokeStyle = marker.color;

  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.moveTo(prevPos.x, prevPos.y);
  ctx.lineTo(curPos.x, curPos.y);
  ctx.stroke();
  ctx.closePath();
}

module.exports = draw
