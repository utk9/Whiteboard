import {
  colorMap,
  sizeMap,
} from './maps.js'

export const toolList = document.querySelector('.tool-palette')
export const canvas = document.getElementById('canvas-main')
export const cursorCanvas = document.getElementById('canvas-cursor')
export const board = document.querySelector('.board')
export const overlay = document.querySelector('.overlay')
export const loadingIcon = document.querySelector('.loading-icon')
export const passModal = document.querySelector('.password-modal')

// TODO: Memoize the values
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
    toolList.querySelector(`.${name}.display`) :
    toolList.querySelector(`.${name}.no-display`)
}
