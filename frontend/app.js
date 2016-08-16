var draw = require('./draw.js')

var toolAttributes = require('./toolAttributes.js').attributes
var marker = toolAttributes.marker
var eraser = toolAttributes.eraser

var selectedTool = require('./toolAttributes.js').selectedTool

var canvas = require('./domNodes.js').canvas
var board = require('./domNodes.js').board
var toolList = require('./domNodes.js').toolList
var splatter = require('./domNodes.js').splatter
var colorPalette = require('./domNodes.js').colorPalette
var size = require('./domNodes.js').size
var markerSizePalette = require('./domNodes.js').markerSizePalette

var colorMap = require('./maps.js').colorMap
var sizeMap = require('./maps.js').sizeMap

document.addEventListener('DOMContentLoaded', function() {

  // Initialize the canvas and draw settings
  setSize();
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;

  // Select the default tool, color and size
  selectTool(document.querySelector('.marker'))
  selectMarkerSize(document.querySelector('.size-circle.size-5'))
  selectColor(document.querySelector('.color-box.gray'))

  // Adds listeners to select the tool, color, size etc.
  var tools = Array.prototype.slice.call(toolList.children);
  tools.forEach(addToolSelectorListener);

  var colors = Array.prototype.slice.call(colorPalette.children);
  colors.forEach(addColorSelectorListener);

  var markerSizes = Array.prototype.slice.call(markerSizePalette.children);
  markerSizes.forEach(addSizeSelectorListener);

  // Adds listener to open palettes
  var splatters = [document.querySelector('.splatter'), document.querySelector('.splatter.no-display')]
  splatters.forEach(addColorPaletteListener);

  size.addEventListener('mousedown', function(e) {
    markerSizePalette.classList.toggle('open-palette');
  });

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


  function setSize() {
    canvas.width = board.offsetWidth;
    canvas.height = board.offsetHeight;
  }

  function toggleTool(tool) {
    // Display the version of the tool that is being hidden and
    // hide the one that is displayed
    var toDisplay = document.querySelector(`.${tool.classList[1]}.no-display`);
    tool.classList.add('no-display');
    toDisplay.classList.remove('no-display');

    return toDisplay
  }

  function addToolSelectorListener(tool) {
    tool.addEventListener('mousedown', function() {
      selectTool(tool)
    })
  }

  function selectTool(tool) {
    var newTool
    if (tool !== selectedTool.element) {
      newTool = toggleTool(tool);
      if (selectedTool.element) {
        toggleTool(selectedTool.element);
      }
      selectedTool.element = newTool;
      selectedTool.name = newTool.classList[1]
    }
  }

  function addColorPaletteListener(splatter) {
    splatter.addEventListener('mousedown', function(e) {
      colorPalette.classList.toggle('open-palette');
    });
  }


  function addColorSelectorListener(color) {
    color.addEventListener('mousedown', function(e) {
      selectColor(color)
      colorPalette.classList.toggle('open-palette')
    });
  }

  function selectColor(color) {
    var previousColor = marker.color;
    marker.color = colorMap[color.classList[1]];

    // Toggle the border around the black splatter
    if ((marker.color === '#151515' || previousColor === '#151515')
      && previousColor !== marker.color) {
      splatter = toggleTool(splatter);
    }

    splatter.setAttribute("style", `background-color: ${marker.color}`)
  }

  function addSizeSelectorListener(size, index) {
    size.addEventListener('mousedown', function(e) {
      selectMarkerSize(size)
      markerSizePalette.classList.toggle('open-palette')
    });
  }

  function selectMarkerSize(size) {
    marker.size = sizeMap[size.classList[1].replace('size-', '')];
    size.classList.toggle('selected')
    if (marker.sizeElement) {
      marker.sizeElement.classList.toggle('selected')
    }
    marker.sizeElement = size;
  }
});
