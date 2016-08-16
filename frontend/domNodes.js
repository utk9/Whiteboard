var colorMap = require('./maps.js').colorMap
var sizeMap = require('./maps.js').sizeMap

var canvas = document.getElementById('canvas-main');
var board = document.querySelector('.board');

var toolList = document.querySelector('.toolList');

var splatter = document.querySelector('.splatter');
var colorPalette = document.querySelector('.color-palette');

var size = document.querySelector('.size');
var markerSizePalette = document.querySelector('.marker-size-palette');
var eraserSizePalette = document.querySelector('.eraser-size-palette');

var getSizeElement = function (type, size) {
  if (type === 'marker') {

  }
  if (type === 'eraser') {

  }
}

var getColorElement = function (color) {

}

module.exports = {
  canvas: canvas,
  board: board,
  toolList: toolList,
  splatter: splatter,
  colorPalette: colorPalette,
  size: size,
  markerSizePalette: markerSizePalette,
  eraserSizePalette: eraserSizePalette,
}
