// Tool attributes
var toolAttributes = require('./toolAttributes.js').attributes
var marker = toolAttributes.marker
var eraser = toolAttributes.eraser

var selectedTool = require('./toolAttributes.js').selectedTool
var openedPalette = require('./toolAttributes.js').openedPalette

// Maps
var colorMap = require('./maps.js').colorMap
var sizeMap = require('./maps.js').sizeMap

// Dom nodes
var splatter = require('./domNodes.js').splatter
var colorPalette = require('./domNodes.js').colorPalette

var size = require('./domNodes.js').size
var markerSizePalette = require('./domNodes.js').markerSizePalette
var eraserSizePalette = require('./domNodes.js').eraserSizePalette

var getColorElement = require('./domNodes.js').getColorElement
var getSizeElement = require('./domNodes.js').getSizeElement
var getPaletteElement = require('./domNodes.js').getPaletteElement

var toggleTool = function (tool) {
  // Display the version of the tool that is being hidden and
  // hide the one that is displayed
  var toDisplay = document.querySelector(`.${tool.classList[1]}.no-display`);
  tool.classList.add('no-display');
  toDisplay.classList.remove('no-display');

  return toDisplay
}

var addToolPaletteListener = function (tool) {
  tool.addEventListener('mousedown', function () {
    selectTool(tool)
  })
}

var selectTool = function (tool) {
  var newTool
  if (tool !== selectedTool.element) {
    newTool = toggleTool(tool);
    if (selectedTool.element) {
      toggleTool(selectedTool.element);
    }
    selectedTool.element = newTool;
    selectedTool.name = newTool.classList[1]
    selectedTool.attributes = toolAttributes[selectedTool.name]
  }
}

var addColorToolListener = function (splatter) {
  splatter.addEventListener('mousedown', function (e) {
    togglePalette('color')
  });
}


var addColorPaletteListener = function (color) {
  color.addEventListener('mousedown', function (e) {
    selectColor(color)
    togglePalette()
  });
}

var selectColor = function (color) {
  var previousColor = marker.color;
  marker.color = colorMap[color.classList[1]];

  // Toggle the border around the black splatter
  if ((marker.color === '#151515' || previousColor === '#151515')
    && previousColor !== marker.color) {
    splatter = toggleTool(splatter);
  }

  splatter.setAttribute("style", `background-color: ${marker.color}`)
}

var addSizeToolListener = function (size) {
  size.addEventListener('mousedown', function (e) {
    if (selectedTool.name === 'marker') {
      togglePalette('marker-size')
    } else if (selectedTool.name === 'eraser') {
      togglePalette('eraser-size')
    }
  })
}

// var addSizePaletteListener = function (size, index) {
//   size.addEventListener('mousedown', function (e) {
//     selectMarkerSize(size)
//     togglePalette()
//   });
// }

// var selectMarkerSize = function (size) {
//   marker.size = sizeMap[size.classList[1].replace('size-', '')];
//   size.classList.toggle('selected')
//   if (marker.sizeElement) {
//     marker.sizeElement.classList.toggle('selected')
//   }
//   marker.sizeElement = size;
// }

var addSizePaletteListener = function (size, index) {
  size.addEventListener('mousedown', function (e) {
    selectSize(size, 'marker')
    togglePalette()
  });
}

var selectSize = function (size, type) {
  var tool = type === 'marker' ? marker : eraser

  tool.size = sizeMap[size.classList[1].replace('size-', '')];
  size.classList.toggle('selected')
  if (tool.sizeElement) {
    tool.sizeElement.classList.toggle('selected')
  }
  tool.sizeElement = size;
}


// Palette functions
var togglePalette = function (name) {
  if (name && name !== openedPalette.name) {
    openPalette(name)
  } else {
    closePalette()
  }
}

var openPalette = function (name) {
  closePalette()

  openedPalette.name = name
  openedPalette.element = getPaletteElement(name)
  openedPalette.element.classList.toggle('open-palette')
}

var closePalette = function () {
  if (openedPalette.element) {
    openedPalette.element.classList.toggle('open-palette')
    openedPalette.name = ''
    openedPalette.element = null
  }
}

module.exports = {
  toggleTool: toggleTool,
  addToolPaletteListener: addToolPaletteListener,
  selectTool: selectTool,
  addColorToolListener: addColorToolListener,
  addColorPaletteListener: addColorPaletteListener,
  selectColor: selectColor,
  addSizePaletteListener: addSizePaletteListener,
  addSizeToolListener: addSizeToolListener,
  selectSize: selectSize,
}
