let draw = require('./draw.js')

// Tool attributes
let toolAttributes = require('./toolAttributes.js').attributes
let marker = toolAttributes.marker
let eraser = toolAttributes.eraser

let selectedTool = require('./toolAttributes.js').selectedTool

// Dom nodes
let canvas = require('./domNodes.js').canvas
let board = require('./domNodes.js').board
let toolList = require('./domNodes.js').toolList

let splatter = require('./domNodes.js').splatter
let splatterOutline = require('./domNodes.js').splatterOutline
let colorPalette = require('./domNodes.js').colorPalette

let size = require('./domNodes.js').size
let markerSizePalette = require('./domNodes.js').markerSizePalette
let eraserSizePalette = require('./domNodes.js').eraserSizePalette

let getColorElement = require('./domNodes.js').getColorElement
let getSizeElement = require('./domNodes.js').getSizeElement
let getPaletteElement = require('./domNodes.js').getPaletteElement

// Tools
let selectSize = require('./tools.js').selectSize
let selectTool = require('./tools.js').selectTool
let selectColor = require('./tools.js').selectColor
let addToolPaletteListener = require('./tools.js').addToolPaletteListener
let addColorPaletteListener = require('./tools.js').addColorPaletteListener
let addSizePaletteListener = require('./tools.js').addSizePaletteListener
let addColorToolListener = require('./tools.js').addColorToolListener
let addSizeToolListener = require('./tools.js').addSizeToolListener

// Populate canvas with current draw data
let canvasData = require('./canvasData').canvasData
let url = window.location.href
let canvasName = url.substring(url.lastIndexOf('/') + 1)
canvasData.name = canvasName

document.addEventListener('DOMContentLoaded', function() {

  // Initialize the canvas and draw settings
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;

  InitializeSockets();

  // Select the default tool, color and size
  selectTool(document.querySelector('.marker'))
  selectSize(getSizeElement(5, 'marker'), 'marker')
  selectColor(getColorElement('gray'))

  // Adds listeners to select the tool, color, size etc.
  let tools = Array.prototype.slice.call(toolList.children);
  tools.forEach(addToolPaletteListener);

  let colors = Array.prototype.slice.call(colorPalette.children);
  colors.forEach(addColorPaletteListener);

  let markerSizes = Array.prototype.slice.call(markerSizePalette.children);
  markerSizes.forEach(addSizePaletteListener);

  // Adds listener to open palettes
  addColorToolListener(splatter)
  addColorToolListener(splatterOutline)

  addSizeToolListener(size)

  // Drawing functionality
  canvas.addEventListener('mousemove', function (e) {
    draw('move', e);
  }, false);

  canvas.addEventListener('mousedown', function (e) {
    draw('down', e);
  }, false);

  canvas.addEventListener('mouseup', function (e) {
    draw('up', e);
  }, false);

  canvas.addEventListener('mouseout', function (e) {
    draw('out', e);
  }, false);
});
