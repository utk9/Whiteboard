var draw = require('./draw.js')

// Tool attributes
var toolAttributes = require('./toolAttributes.js').attributes
var marker = toolAttributes.marker
var eraser = toolAttributes.eraser

var selectedTool = require('./toolAttributes.js').selectedTool

// Dom nodes
var canvas = require('./domNodes.js').canvas
var board = require('./domNodes.js').board
var toolList = require('./domNodes.js').toolList

var splatter = require('./domNodes.js').splatter
var splatterOutline = require('./domNodes.js').splatterOutline
var colorPalette = require('./domNodes.js').colorPalette

var size = require('./domNodes.js').size
var markerSizePalette = require('./domNodes.js').markerSizePalette
var eraserSizePalette = require('./domNodes.js').eraserSizePalette

var getColorElement = require('./domNodes.js').getColorElement
var getSizeElement = require('./domNodes.js').getSizeElement
var getPaletteElement = require('./domNodes.js').getPaletteElement

// Tools
var selectMarkerSize = require('./tools.js').selectMarkerSize
var selectTool = require('./tools.js').selectTool
var selectColor = require('./tools.js').selectColor
var addToolSelectorListener = require('./tools.js').addToolSelectorListener
var addColorSelectorListener = require('./tools.js').addColorSelectorListener
var addSizeSelectorListener = require('./tools.js').addSizeSelectorListener
var addColorPaletteListener = require('./tools.js').addColorPaletteListener
var addSizePaletteListener = require('./tools.js').addSizePaletteListener

// Populate canvas with current draw data
var canvasData = require('./canvasData').canvasData
var url = window.location.href
var canvasName = url.substring(url.lastIndexOf('/') + 1)
canvasData.name = canvasName

document.addEventListener('DOMContentLoaded', function() {

  // Initialize the canvas and draw settings
  setSize();
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;

  // Select the default tool, color and size
  selectTool(document.querySelector('.marker'))

  selectMarkerSize(getSizeElement(5, 'marker'))
  selectColor(getColorElement('gray'))

  // Adds listeners to select the tool, color, size etc.
  var tools = Array.prototype.slice.call(toolList.children);
  tools.forEach(addToolSelectorListener);

  var colors = Array.prototype.slice.call(colorPalette.children);
  colors.forEach(addColorSelectorListener);

  var markerSizes = Array.prototype.slice.call(markerSizePalette.children);
  markerSizes.forEach(addSizeSelectorListener);

  // Adds listener to open palettes
  addColorPaletteListener(splatter)
  addColorPaletteListener(splatterOutline)

  addSizePaletteListener(size)

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


  function setSize () {
    canvas.width = board.offsetWidth;
    canvas.height = board.offsetHeight;
  }
});
