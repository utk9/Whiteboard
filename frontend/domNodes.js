import {
  colorMap,
  sizeMap,
} from './maps.js'

const toolPalette = document.querySelector('.tool-palette')

export const canvas = document.getElementById('canvas-main')
export const board = document.querySelector('.board');
export const loadingOverlay = document.querySelector('.loading-overlay')

export const getPaletteElement = function (name) {
  return document.querySelector(`.${name}-palette`)
}

export const getSizeElement = function (index, name) {
  if (name === 'marker') {
    const markerSizePalette = getPaletteElement('marker-size')
    return markerSizePalette.querySelector(`.size-circle.size-${index}`)
  }
  if (name === 'eraser') {
    const eraserSizePalette = getPaletteElement('eraser-size')
    return eraserSizePalette.querySelector(`.size-circle.size-${index}`)
  }

  console.error(`[${name}] is not a valid tool for getting a size element`)
}

export const getColorElement = function (color) {
  const colorPalette = getPaletteElement('color')
  return colorPalette.querySelector(`.color-box.${color}`)
}

export const getToolElement = function (name, displayed=true) {
  return displayed ?
    toolPalette.querySelector(`.${name}.display`) :
    toolPalette.querySelector(`.${name}.no-display`)
}
