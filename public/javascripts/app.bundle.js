/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var draw = __webpack_require__(1)

	var toolAttributes = __webpack_require__(4).attributes
	var marker = toolAttributes.marker
	var eraser = toolAttributes.eraser

	var selectedTool = __webpack_require__(4).selectedTool

	var canvas = __webpack_require__(2).canvas
	var board = __webpack_require__(2).board
	var toolList = __webpack_require__(2).toolList
	var splatter = __webpack_require__(2).splatter
	var colorPalette = __webpack_require__(2).colorPalette
	var size = __webpack_require__(2).size
	var markerSizePalette = __webpack_require__(2).markerSizePalette

	var colorMap = __webpack_require__(3).colorMap
	var sizeMap = __webpack_require__(3).sizeMap

	// Populate canvas with current draw data
	var canvasData = __webpack_require__(5).canvasData
	var url = window.location.href
	var canvasName = url.substring(url.lastIndexOf('/') + 1)
	canvasData.name = canvasName

	console.log(canvasData.name)

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var canvas = __webpack_require__(2).canvas;

	var toolAttributes = __webpack_require__(3).attributes;

	var marker = toolAttributes.marker

	var canvasData = __webpack_require__(4).canvasData;

	var drawing = false;
	var prevPos = { x: 0, y: 0 }
	var curPos = { x: 0, y: 0 }
	var ctx = canvas.getContext('2d');

	var socket = io();
	socket.emit("new_user", canvasData);

	socket.on("canvas_redraw", function (canvas) {
	  console.log(canvas);
	});

	socket.on("canvas_update", function(points) {
	  console.log(points);
	});

	var draw = function(type, e) {

	  if (type === 'down') {
	    setCurrentPos(e);

	    // Draw the first dot
	    ctx.beginPath();
	    ctx.fillStyle = marker.color;
	    ctx.arc(curPos.x, curPos.y, marker.size/2, 0, 2 * Math.PI);
	    ctx.fill();
	    ctx.closePath();

	    drawing = true;

	  } else if (type === 'move') {
	    if (drawing) {
	      setPrevPos();
	      setCurrentPos(e);
	      stroke();
	    }
	  } else if (type === 'up' || type === 'out') {
	    drawing = false;
	  }

	}

	function setPrevPos() {
	  prevPos.x = curPos.x;
	  prevPos.y = curPos.y;
	}

	function setCurrentPos(e) {
	  curPos.x = e.clientX - canvas.offsetLeft;
	  curPos.y = e.clientY - canvas.offsetTop;
	}

	function stroke() {
	  ctx.beginPath();

	  ctx.lineWidth = marker.size;
	  ctx.strokeStyle = marker.color;

	  ctx.lineJoin = ctx.lineCap = 'round';
	  ctx.moveTo(prevPos.x, prevPos.y);
	  ctx.lineTo(curPos.x, curPos.y);

	  socket.emit("new_stroke", {canvasName: canvasData.name, points: [prevPos, curPos]});

	  ctx.stroke();
	  ctx.closePath();
	}

	module.exports = draw


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var colorMap = __webpack_require__(3).colorMap
	var sizeMap = __webpack_require__(3).sizeMap

	var canvas = document.getElementById('canvas-main');
	var board = document.querySelector('.board');

	var toolList = document.querySelector('.toolList');

	var splatter = document.querySelector('.splatter');
	var colorPalette = document.querySelector('.color-palette');

	var size = document.querySelector('.size');
	var markerSizePalette = document.querySelector('.marker-size-palette');
	var eraserSizePalette = document.querySelector('.eraser-size-palette');

	var getSizeElement = function (type, size) {
	  if (type === 'marker') {

	  }
	  if (type === 'eraser') {

	  }
	}

	var getColorElement = function (color) {

	}

	module.exports = {
	  canvas: canvas,
	  board: board,
	  toolList: toolList,
	  splatter: splatter,
	  colorPalette: colorPalette,
	  size: size,
	  markerSizePalette: markerSizePalette,
	  eraserSizePalette: eraserSizePalette,
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports.sizeMap = [45, 36, 30, 25, 20, 15, 10]

	module.exports.colorMap = {
	  red: '#ec8168',
	  orange: '#f2cc72',
	  yellow: '#f5ef95',
	  green: '#b9f595',
	  blue: '#95d6f5',
	  purple: '#d7b0f2',
	  gray: '#b8b8b8',
	  black: '#151515',
	  white: '#ffffff',
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var toolList = __webpack_require__(2).toolList

	module.exports.attributes = {
	  marker: {
	    color: '',
	    size: 0,
	    sizeElement: null,
	  },
	  eraser: {
	    color: '#fff',
	    size: 0,
	    sizeElement: null,
	  },
	};
	module.exports.selectedTool = {
	  name: '',
	  element: null,
	};


/***/ },

/***/ function(module, exports) {

	module.exports.canvasData = {
	  name: '',
	  width: 0,
	  height: 0,
	  strokes: [],
	}


/***/ }
/******/ ]);