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

	'use strict';

	var draw = __webpack_require__(1);

	// Tool attributes
	var toolAttributes = __webpack_require__(4).attributes;
	var marker = toolAttributes.marker;
	var eraser = toolAttributes.eraser;

	var selectedTool = __webpack_require__(4).selectedTool;

	// Dom nodes
	var canvas = __webpack_require__(2).canvas;
	var board = __webpack_require__(2).board;
	var toolList = __webpack_require__(2).toolList;

	var splatter = __webpack_require__(2).splatter;
	var splatterOutline = __webpack_require__(2).splatterOutline;
	var colorPalette = __webpack_require__(2).colorPalette;

	var size = __webpack_require__(2).size;
	var markerSizePalette = __webpack_require__(2).markerSizePalette;
	var eraserSizePalette = __webpack_require__(2).eraserSizePalette;

	var getColorElement = __webpack_require__(2).getColorElement;
	var getSizeElement = __webpack_require__(2).getSizeElement;
	var getPaletteElement = __webpack_require__(2).getPaletteElement;

	// Tools
	var selectMarkerSize = __webpack_require__(6).selectMarkerSize;
	var selectTool = __webpack_require__(6).selectTool;
	var selectColor = __webpack_require__(6).selectColor;
	var addToolPaletteListener = __webpack_require__(6).addToolPaletteListener;
	var addColorPaletteListener = __webpack_require__(6).addColorPaletteListener;
	var addSizePaletteListener = __webpack_require__(6).addSizePaletteListener;
	var addColorToolListener = __webpack_require__(6).addColorToolListener;
	var addSizeToolListener = __webpack_require__(6).addSizeToolListener;

	// Populate canvas with current draw data
	var canvasData = __webpack_require__(5).canvasData;
	var url = window.location.href;
	var canvasName = url.substring(url.lastIndexOf('/') + 1);
	canvasData.name = canvasName;

	document.addEventListener('DOMContentLoaded', function () {

	  // Initialize the canvas and draw settings
	  setSize();
	  canvas.width = board.offsetWidth;
	  canvas.height = board.offsetHeight;

	  // Select the default tool, color and size
	  selectTool(document.querySelector('.marker'));

	  selectMarkerSize(getSizeElement(5, 'marker'));
	  selectColor(getColorElement('gray'));

	  // Adds listeners to select the tool, color, size etc.
	  var tools = Array.prototype.slice.call(toolList.children);
	  tools.forEach(addToolPaletteListener);

	  var colors = Array.prototype.slice.call(colorPalette.children);
	  colors.forEach(addColorPaletteListener);

	  var markerSizes = Array.prototype.slice.call(markerSizePalette.children);
	  markerSizes.forEach(addSizePaletteListener);

	  // Adds listener to open palettes
	  addColorToolListener(splatter);
	  addColorToolListener(splatterOutline);

	  addSizeToolListener(size);

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
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var canvas = __webpack_require__(2).canvas;
	var loadingOverlay = __webpack_require__(2).loadingOverlay;
	var selectedTool = __webpack_require__(4).selectedTool;

	var canvasData = __webpack_require__(5).canvasData;

	var drawing = false;
	var prevPos = { x: 0, y: 0 };
	var curPos = { x: 0, y: 0 };
	var ctx = canvas.getContext('2d');

	var socket = io();
	socket.emit("new_user", { canvasInfo: canvasData, pass: null });

	// Canvas password logic
	var passModal = $("#password-modal");

	passModal.modal({
	  backdrop: 'static',
	  keyboard: false
	});

	var submitButton = document.getElementById('password-submit');
	var passwordInput = document.getElementById('password-input');
	var errorSpan = document.getElementById('error');

	submitButton.addEventListener('click', function () {
	  var password = passwordInput.value;
	  if (!isBlank(password)) {
	    socket.emit("new_user", { canvasInfo: canvasData, pass: password });
	  } else {
	    errorSpan.innerHTML = 'Please enter the password.';
	  }
	});
	function isBlank(str) {
	  return !str || str.trim() === '';
	}

	socket.on("password_required", function () {
	  passModal.modal('show');
	});

	socket.on("incorrect_password", function () {
	  errorSpan.innerHTML = 'The password entered was incorrect';
	});

	socket.on("canvas_redraw", function (canvasInfo) {
	  console.log(canvasInfo); //change this to actually draw the canvas data onto teh canvas
	  //canvas.width = 400;
	  passModal.modal('hide');
	  loadingOverlay.classList.add("no-display");
	});

	socket.on("canvas_update", function (data) {
	  update(data.points[0], data.points[1], data.toolAttributes);
	});

	var draw = function draw(type, e) {

	  if (type === 'down') {
	    setCurrentPos(e);

	    // Draw the first dot
	    ctx.beginPath();
	    ctx.fillStyle = selectedTool.attributes.color;
	    ctx.arc(curPos.x, curPos.y, selectedTool.attributes.size / 2, 0, 2 * Math.PI);
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
	};

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

	  ctx.lineWidth = selectedTool.attributes.size;
	  ctx.strokeStyle = selectedTool.attributes.color;

	  ctx.lineJoin = ctx.lineCap = 'round';
	  ctx.moveTo(prevPos.x, prevPos.y);
	  ctx.lineTo(curPos.x, curPos.y);

	  socket.emit("new_stroke", {
	    toolAttributes: selectedTool.attributes,
	    canvasName: canvasData.name,
	    points: [prevPos, curPos]
	  });

	  ctx.stroke();
	  ctx.closePath();
	}

	function update(prevPos, curPos, toolAttributes) {
	  ctx.beginPath();

	  ctx.lineWidth = toolAttributes.size;
	  ctx.strokeStyle = toolAttributes.color;

	  ctx.lineJoin = ctx.lineCap = 'round';
	  ctx.moveTo(prevPos.x, prevPos.y);
	  ctx.lineTo(curPos.x, curPos.y);

	  ctx.stroke();
	  ctx.closePath();
	}

	module.exports = draw;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var colorMap = __webpack_require__(3).colorMap;
	var sizeMap = __webpack_require__(3).sizeMap;

	var canvas = document.getElementById('canvas-main');
	var board = document.querySelector('.board');

	var toolList = document.querySelector('.toolList');

	var splatter = document.querySelector('.splatter');
	var splatterOutline = document.querySelector('.splatter-outline');
	var colorPalette = document.querySelector('.color-palette');

	var size = document.querySelector('.size');
	var markerSizePalette = document.querySelector('.marker-size-palette');
	var eraserSizePalette = document.querySelector('.eraser-size-palette');

	var loadingOverlay = document.querySelector('.loading-overlay');

	var getPaletteElement = function getPaletteElement(name) {
	  return document.querySelector('.' + name + '-palette');
	};

	var getSizeElement = function getSizeElement(size, type) {
	  if (type === 'marker') {
	    return markerSizePalette.querySelector('.size-circle.size-' + size);
	  }
	  if (type === 'eraser') {
	    return eraserSizePalette.querySelector('.size-circle.size-' + size);
	  }
	};

	var getColorElement = function getColorElement(color) {
	  return colorPalette.querySelector('.color-box.' + color);
	};

	var getToolElement = function getToolElement(name, displayed) {
	  if (displayed) return toolList.querySelector('.' + name);
	};

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
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports.sizeMap = [45, 36, 30, 25, 20, 15, 10];

	module.exports.colorMap = {
	  red: '#ec8168',
	  orange: '#f2cc72',
	  yellow: '#f5ef95',
	  green: '#b9f595',
	  blue: '#95d6f5',
	  purple: '#d7b0f2',
	  gray: '#b8b8b8',
	  black: '#151515',
	  white: '#ffffff'
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toolList = __webpack_require__(2).toolList;

	module.exports.attributes = {
	  marker: {
	    color: '',
	    size: 0,
	    sizeElement: null
	  },
	  eraser: {
	    color: '#fff',
	    size: 0,
	    sizeElement: null
	  }
	};
	module.exports.selectedTool = {
	  name: '',
	  element: null,
	  attributes: {}
	};
	module.exports.openedPalette = {
	  name: '',
	  element: null
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports.canvasData = {
	  name: '',
	  width: 0,
	  height: 0,
	  strokes: []
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Tool attributes
	var toolAttributes = __webpack_require__(4).attributes;
	var marker = toolAttributes.marker;
	var eraser = toolAttributes.eraser;

	var selectedTool = __webpack_require__(4).selectedTool;
	var openedPalette = __webpack_require__(4).openedPalette;

	// Maps
	var colorMap = __webpack_require__(3).colorMap;
	var sizeMap = __webpack_require__(3).sizeMap;

	// Dom nodes
	var splatter = __webpack_require__(2).splatter;
	var colorPalette = __webpack_require__(2).colorPalette;

	var size = __webpack_require__(2).size;
	var markerSizePalette = __webpack_require__(2).markerSizePalette;
	var eraserSizePalette = __webpack_require__(2).eraserSizePalette;

	var getColorElement = __webpack_require__(2).getColorElement;
	var getSizeElement = __webpack_require__(2).getSizeElement;
	var getPaletteElement = __webpack_require__(2).getPaletteElement;

	var toggleTool = function toggleTool(tool) {
	  // Display the version of the tool that is being hidden and
	  // hide the one that is displayed
	  var toDisplay = document.querySelector('.' + tool.classList[1] + '.no-display');
	  tool.classList.add('no-display');
	  toDisplay.classList.remove('no-display');

	  return toDisplay;
	};

	var addToolPaletteListener = function addToolPaletteListener(tool) {
	  tool.addEventListener('mousedown', function () {
	    selectTool(tool);
	  });
	};

	var selectTool = function selectTool(tool) {
	  var newTool;
	  if (tool !== selectedTool.element) {
	    newTool = toggleTool(tool);
	    if (selectedTool.element) {
	      toggleTool(selectedTool.element);
	    }
	    selectedTool.element = newTool;
	    selectedTool.name = newTool.classList[1];
	    selectedTool.attributes = toolAttributes[selectedTool.name];
	  }
	};

	var addColorToolListener = function addColorToolListener(splatter) {
	  splatter.addEventListener('mousedown', function (e) {
	    togglePalette('color');
	  });
	};

	var addColorPaletteListener = function addColorPaletteListener(color) {
	  color.addEventListener('mousedown', function (e) {
	    selectColor(color);
	    togglePalette();
	  });
	};

	var selectColor = function selectColor(color) {
	  var previousColor = marker.color;
	  marker.color = colorMap[color.classList[1]];

	  // Toggle the border around the black splatter
	  if ((marker.color === '#151515' || previousColor === '#151515') && previousColor !== marker.color) {
	    splatter = toggleTool(splatter);
	  }

	  splatter.setAttribute("style", 'background-color: ' + marker.color);
	};

	var addSizeToolListener = function addSizeToolListener(size) {
	  size.addEventListener('mousedown', function (e) {
	    if (selectedTool.name === 'marker') {
	      togglePalette('marker-size');
	    } else if (selectedTool.name === 'eraser') {
	      togglePalette('eraser-size');
	    }
	  });
	};

	var addSizePaletteListener = function addSizePaletteListener(size, index) {
	  size.addEventListener('mousedown', function (e) {
	    selectMarkerSize(size);
	    togglePalette();
	  });
	};

	var selectMarkerSize = function selectMarkerSize(size) {
	  marker.size = sizeMap[size.classList[1].replace('size-', '')];
	  size.classList.toggle('selected');
	  if (marker.sizeElement) {
	    marker.sizeElement.classList.toggle('selected');
	  }
	  marker.sizeElement = size;
	};

	var togglePalette = function togglePalette(name) {
	  if (name && name !== openedPalette.name) {
	    openPalette(name);
	  } else {
	    closePalette();
	  }
	};

	var openPalette = function openPalette(name) {
	  closePalette();

	  openedPalette.name = name;
	  openedPalette.element = getPaletteElement(name);
	  openedPalette.element.classList.toggle('open-palette');
	};

	var closePalette = function closePalette() {
	  if (openedPalette.element) {
	    openedPalette.element.classList.toggle('open-palette');
	    openedPalette.name = '';
	    openedPalette.element = null;
	  }
	};

	module.exports = {
	  toggleTool: toggleTool,
	  addToolPaletteListener: addToolPaletteListener,
	  selectTool: selectTool,
	  addColorToolListener: addColorToolListener,
	  addColorPaletteListener: addColorPaletteListener,
	  selectColor: selectColor,
	  addSizePaletteListener: addSizePaletteListener,
	  addSizeToolListener: addSizeToolListener,
	  selectMarkerSize: selectMarkerSize
	};

/***/ }
/******/ ]);