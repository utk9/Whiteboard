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

	var _toolClasses = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./toolClasses.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _domNodes = __webpack_require__(2);

	var _maps = __webpack_require__(3);

	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = new _toolClasses.Canvas();
	  var splatter = new _toolClasses.Splatter();

	  var marker = new _toolClasses.Marker('gray', 5, splatter);
	  var eraser = new _toolClasses.Eraser(5);

	  canvas.addTools([marker, eraser]);
	  canvas.setTool(marker);

	  var toolPalette = new _toolClasses.Palette('tool', canvas.selectToolWithElement);

	  // // Drawing functionality
	  //  canvas.addEventListener('mousemove', function (e) {
	  //    draw('move', e);
	  //  }, false);

	  //  canvas.addEventListener('mousedown', function (e) {
	  //    draw('down', e);
	  //  }, false);

	  //  canvas.addEventListener('mouseup', function (e) {
	  //    draw('up', e);
	  //  }, false);

	  //  canvas.addEventListener('mouseout', function (e) {
	  //    draw('out', e);
	  //  }, false);
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var colorMap = __webpack_require__(3).colorMap;
	var sizeMap = __webpack_require__(3).sizeMap;

	var canvas = document.getElementById('canvas-main');
	var board = document.querySelector('.board');

	var toolList = document.querySelector('.tool-palette');

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

	var getSizeElement = function getSizeElement(index, name) {
	  if (name === 'marker') {
	    return markerSizePalette.querySelector('.size-circle.size-' + index);
	  }
	  if (name === 'eraser') {
	    return eraserSizePalette.querySelector('.size-circle.size-' + index);
	  }
	};

	var getColorElement = function getColorElement(color) {
	  return colorPalette.querySelector('.color-box.' + color);
	};

	var getToolElement = function getToolElement(name) {
	  var displayed = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	  return displayed ? toolList.querySelector('.' + name + '.display') : toolList.querySelector('.' + name + '.no-display');
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

/***/ }
/******/ ]);