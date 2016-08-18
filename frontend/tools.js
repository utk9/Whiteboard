// Tool attributes
let toolAttributes = require('./toolAttributes.js').attributes
let marker = toolAttributes.marker
let eraser = toolAttributes.eraser

let selectedTool = require('./toolAttributes.js').selectedTool
let openedPalette = require('./toolAttributes.js').openedPalette

// Maps
let colorMap = require('./maps.js').colorMap
let sizeMap = require('./maps.js').sizeMap

// Dom nodes
let splatter = require('./domNodes.js').splatter
let colorPalette = require('./domNodes.js').colorPalette

let size = require('./domNodes.js').size
let markerSizePalette = require('./domNodes.js').markerSizePalette
let eraserSizePalette = require('./domNodes.js').eraserSizePalette

let getColorElement = require('./domNodes.js').getColorElement
let getSizeElement = require('./domNodes.js').getSizeElement
let getPaletteElement = require('./domNodes.js').getPaletteElement

let toggleTool = function (tool) {
  // Display the version of the tool that is being hidden and
  // hide the one that is displayed
  let toDisplay = document.querySelector(`.${tool.classList[1]}.no-display`);
  tool.classList.add('no-display');
  toDisplay.classList.remove('no-display');

  return toDisplay
}

let addToolPaletteListener = function (tool) {
  tool.addEventListener('mousedown', function () {
    selectTool(tool)
  })
}

let selectTool = function (tool) {
  let newTool
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

let addColorToolListener = function (splatter) {
  splatter.addEventListener('mousedown', function (e) {
    togglePalette('color')
  });
}


let addColorPaletteListener = function (color) {
  color.addEventListener('mousedown', function (e) {
    selectColor(color)
    togglePalette()
  });
}

let selectColor = function (color) {
  let previousColor = marker.color;
  marker.color = colorMap[color.classList[1]];

  // Toggle the border around the black splatter
  if ((marker.color === '#151515' || previousColor === '#151515')
    && previousColor !== marker.color) {
    splatter = toggleTool(splatter);
  }

  splatter.setAttribute("style", `background-color: ${marker.color}`)
}

let addSizeToolListener = function (size) {
  size.addEventListener('mousedown', function (e) {
    if (selectedTool.name === 'marker') {
      togglePalette('marker-size')
    } else if (selectedTool.name === 'eraser') {
      togglePalette('eraser-size')
    }
  })
}

// let addSizePaletteListener = function (size, index) {
//   size.addEventListener('mousedown', function (e) {
//     selectMarkerSize(size)
//     togglePalette()
//   });
// }

// let selectMarkerSize = function (size) {
//   marker.size = sizeMap[size.classList[1].replace('size-', '')];
//   size.classList.toggle('selected')
//   if (marker.sizeElement) {
//     marker.sizeElement.classList.toggle('selected')
//   }
//   marker.sizeElement = size;
// }

let addSizePaletteListener = function (size, index) {
  size.addEventListener('mousedown', function (e) {
    selectSize(size, 'marker')
    togglePalette()
  });
}

let selectSize = function (size, type) {
  let tool = type === 'marker' ? marker : eraser

  tool.size = sizeMap[size.classList[1].replace('size-', '')];
  size.classList.toggle('selected')
  if (tool.sizeElement) {
    tool.sizeElement.classList.toggle('selected')
  }
  tool.sizeElement = size;
}


// Palette functions
let togglePalette = function (name) {
  if (name && name !== openedPalette.name) {
    openPalette(name)
  } else {
    closePalette()
  }
}

let openPalette = function (name) {
  closePalette()

  openedPalette.name = name
  openedPalette.element = getPaletteElement(name)
  openedPalette.element.classList.toggle('open-palette')
}

let closePalette = function () {
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
