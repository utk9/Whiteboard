let colorMap = require('./maps.js').colorMap
let sizeMap = require('./maps.js').sizeMap

let canvas = document.getElementById('canvas-main');
let board = document.querySelector('.board');

let toolList = document.querySelector('.tool-palette');

let splatter = document.querySelector('.splatter');
let splatterOutline = document.querySelector('.splatter-outline');
let colorPalette = document.querySelector('.color-palette');

let size = document.querySelector('.size');
let markerSizePalette = document.querySelector('.marker-size-palette')
let eraserSizePalette = document.querySelector('.eraser-size-palette')

let loadingOverlay = document.querySelector('.loading-overlay')

let getPaletteElement = function (name) {
  return document.querySelector(`.${name}-palette`)
}

let getSizeElement = function (index, name) {
  if (name === 'marker') {
    return markerSizePalette.querySelector(`.size-circle.size-${index}`)
  }
  if (name === 'eraser') {
    return eraserSizePalette.querySelector(`.size-circle.size-${index}`)
  }
}

let getColorElement = function (color) {
  return colorPalette.querySelector(`.color-box.${color}`)
}

let getToolElement = function (name, displayed=true) {
  return displayed ?
    toolList.querySelector(`.${name}.display`) :
    toolList.querySelector(`.${name}.no-display`)
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
  loadingOverlay: loadingOverlay
}
