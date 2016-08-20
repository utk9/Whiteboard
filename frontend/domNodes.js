let colorMap = require('./maps.js').colorMap
let sizeMap = require('./maps.js').sizeMap

import {
  colorMap,
  sizeMap,
} from './maps.js'

export const canvas = document.getElementById('canvas-main');
export const board = document.querySelector('.board');

export const loadingOverlay = document.querySelector('.loading-overlay')

export const getPaletteElement = function (name) {
  return document.querySelector(`.${name}-palette`)
}

export const getSizeElement = function (index, name) {
  if (name === 'marker') {
    return markerSizePalette.querySelector(`.size-circle.size-${index}`)
  }
  if (name === 'eraser') {
    return eraserSizePalette.querySelector(`.size-circle.size-${index}`)
  }
}

export const getColorElement = function (color) {
  return colorPalette.querySelector(`.color-box.${color}`)
}

export const getToolElement = function (name, displayed=true) {
  return displayed ?
    toolList.querySelector(`.${name}.display`) :
    toolList.querySelector(`.${name}.no-display`)
}

// See markerSizePalette, eraserSizePalette, colorPalette, toolList
