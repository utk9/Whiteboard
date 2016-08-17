var colorMap = require('./maps.js').colorMap
var sizeMap = require('./maps.js').sizeMap

var canvas = document.getElementById('canvas-main');
var board = document.querySelector('.board');

var toolList = document.querySelector('.toolList');

var splatter = document.querySelector('.splatter');
var splatterOutline = document.querySelector('.splatter-outline');
var colorPalette = document.querySelector('.color-palette');

var size = document.querySelector('.size');
var markerSizePalette = document.querySelector('.marker-size-palette')
var eraserSizePalette = document.querySelector('.eraser-size-palette')

var getPaletteElement = function (name) {
  return document.querySelector(`.${name}-palette`)
}

var getSizeElement = function (size, type) {
  if (type === 'marker') {
    return markerSizePalette.querySelector(`.size-circle.size-${size}`)
  }
  if (type === 'eraser') {
    return eraserSizePalette.querySelector(`.size-circle.size-${size}`)
  }
}

var getColorElement = function (color) {
  return colorPalette.querySelector(`.color-box.${color}`)
}

var getToolElement = function (name, displayed) {
  if (displayed)
  return toolList.querySelector(`.${name}`)
}

module.exports = {
  canvas: canvas,
  board: board,
  toolList: toolList,
  splatter: splatter,
  splatterOutline: splatterOutline,
  colorPalette: colorPalette,
  size: size,
  getSizeElement: getSizeElement,
  getColorElement: getColorElement,
  getToolElement: getToolElement,
  getPaletteElement: getPaletteElement,
  markerSizePalette: markerSizePalette,
  eraserSizePalette: eraserSizePalette,
}
