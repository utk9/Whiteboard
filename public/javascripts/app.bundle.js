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

	var _toolClasses = __webpack_require__(1);

	var _domNodes = __webpack_require__(2);

	var _maps = __webpack_require__(3);

	document.addEventListener('DOMContentLoaded', function () {
	  var marker = new _toolClasses.Marker('gray', 5);

	  marker.selectSize(6);
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
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Canvas = exports.Palette = exports.Splatter = exports.PaletteTool = exports.Eraser = exports.Marker = exports.Stroker = exports.Tool = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domNodes = __webpack_require__(2);

	var _maps = __webpack_require__(3);

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tool = exports.Tool = function () {
	  function Tool(name, el) {
	    _classCallCheck(this, Tool);

	    this.name = name;
	    this.el = el;
	  }

	  _createClass(Tool, [{
	    key: 'toggle',
	    value: function toggle() {
	      var elToDisplay = (0, _domNodes.getToolElement)(this.name, false);

	      this.el.classList.remove('display');
	      this.el.classList.add('no-display');

	      elToDisplay.classList.remove('no-display');
	      elToDisplay.classList.add('display');

	      this.el = elToDisplay;
	    }
	  }]);

	  return Tool;
	}();

	var Stroker = exports.Stroker = function (_Tool) {
	  _inherits(Stroker, _Tool);

	  function Stroker(name, el, color, sizeIndex) {
	    _classCallCheck(this, Stroker);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Stroker).call(this, name, el));

	    _this.color = color;
	    _this.size = _maps.sizeMap[sizeIndex];
	    debugger;
	    _this.sizeEl = (0, _domNodes.getSizeElement)(sizeIndex, name);
	    return _this;
	  }

	  _createClass(Stroker, [{
	    key: 'selectSize',
	    value: function selectSize(sizeIndex) {
	      var newSizeEl = (0, _domNodes.getSizeElement)(sizeIndex, name);
	      debugger;
	      newSizeEl.classList.toggle('selected');
	      if (this.sizeEl) {
	        this.sizeEl.classList.toggle('selected');
	      }
	      this.sizeEl = newSizeEl;
	    }
	  }]);

	  return Stroker;
	}(Tool);

	var Marker = exports.Marker = function (_Stroker) {
	  _inherits(Marker, _Stroker);

	  function Marker(color, sizeIndex) {
	    _classCallCheck(this, Marker);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Marker).call(this, 'marker', (0, _domNodes.getToolElement)('marker'), color, sizeIndex));
	  }

	  _createClass(Marker, [{
	    key: 'selectColor',
	    value: function selectColor(colorEl, splatter) {
	      var previousColor = this.color;
	      this.color = _maps.colorMap[colorEl.classList[1]];

	      // Toggle the border around the black splatter
	      if ((this.color === '#151515' || previousColor === '#151515') && previousColor !== this.color) {
	        splatter.toggle();
	      }

	      splatter.setBackgroundColor(this.color);
	    }
	  }]);

	  return Marker;
	}(Stroker);

	var Eraser = exports.Eraser = function (_Stroker2) {
	  _inherits(Eraser, _Stroker2);

	  function Eraser(color, size) {
	    _classCallCheck(this, Eraser);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Eraser).call(this, 'eraser', (0, _domNodes.getToolElement)('eraser'), '#fff', size, sizeEl));
	  }

	  return Eraser;
	}(Stroker);

	var PaletteTool = exports.PaletteTool = function (_Tool2) {
	  _inherits(PaletteTool, _Tool2);

	  function PaletteTool(name, palette) {
	    _classCallCheck(this, PaletteTool);

	    var el = (0, _domNodes.getToolElement)(name);

	    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(PaletteTool).call(this, name, el));

	    _this4.palette = palette;
	    return _this4;
	  }

	  _createClass(PaletteTool, [{
	    key: 'togglePalette',
	    value: function togglePalette(currentPalette) {
	      this.palette.toggle();
	      if (currentPalette !== this.palette) {
	        currentPalette.toggle();
	      }
	    }
	  }]);

	  return PaletteTool;
	}(Tool);

	var Splatter = exports.Splatter = function (_PaletteTool) {
	  _inherits(Splatter, _PaletteTool);

	  function Splatter() {
	    _classCallCheck(this, Splatter);

	    var palette = new Palette('color');
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Splatter).call(this, 'splatter', palette));
	  }

	  _createClass(Splatter, [{
	    key: 'setBackgroundColor',
	    value: function setBackgroundColor(color) {
	      this.el.setAttribute("style", 'background-color: ' + this.color);
	    }
	  }]);

	  return Splatter;
	}(PaletteTool);

	var Palette = exports.Palette = function () {
	  function Palette(name, selectChild) {
	    _classCallCheck(this, Palette);

	    this.name = name;
	    this.el = (0, _domNodes.getPaletteElement)(name);
	    this.children = Array.prototype.slice.call(this.el.children);
	    this.addListeners(selectChild);
	  }

	  _createClass(Palette, [{
	    key: 'toggle',
	    value: function toggle() {
	      this.el.classList.toggle('open-palette');
	    }
	  }, {
	    key: 'addListeners',
	    value: function addListeners(selectChild) {
	      this.children.forEach(function (child) {
	        child.addEventListener('mousedown', function (e) {
	          selectChild(child);
	          this.toggle();
	        });
	      });
	    }
	  }]);

	  return Palette;
	}();

	var Canvas = exports.Canvas = function () {
	  function Canvas(tool) {
	    _classCallCheck(this, Canvas);

	    this.tool = tool;
	  }

	  _createClass(Canvas, [{
	    key: 'selectTool',
	    value: function selectTool() {}
	  }]);

	  return Canvas;
	}();

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

	var getSizeElement = function getSizeElement(index, name) {
	  if (name === 'marker') {
	    if (index === 6) {
	      debugger;
	    }
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