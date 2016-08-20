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

	document.addEventListener('DOMContentLoaded', function () {
	  var toolPalette = new _toolClasses.ToolPalette();
	  toolPalette.initialize();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ToolPalette = exports.Palette = exports.Dots = exports.Splatter = exports.PaletteTool = exports.Eraser = exports.Marker = exports.Stroker = exports.Tool = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domNodes = __webpack_require__(2);

	var _maps = __webpack_require__(3);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tool = exports.Tool = function () {
	  function Tool(name, el) {
	    _classCallCheck(this, Tool);

	    this.name = name;
	    this.el = el;

	    this.toggle = this.toggle.bind(this);
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
	    _this.sizeEl = (0, _domNodes.getSizeElement)(sizeIndex, name);
	    _this.sizeEl.classList.toggle('selected');

	    _this.selectSizeByIndex = _this.selectSizeByIndex.bind(_this);
	    _this.selectSizeByElement = _this.selectSizeByElement.bind(_this);
	    return _this;
	  }

	  _createClass(Stroker, [{
	    key: 'selectSizeByIndex',
	    value: function selectSizeByIndex(sizeIndex) {
	      if (sizeIndex > _maps.sizeMap.length - 1) {
	        console.error('sizeIndex is not valid');
	      }
	      this.size = _maps.sizeMap[sizeIndex];

	      var newSizeEl = (0, _domNodes.getSizeElement)(sizeIndex, this.name);
	      this._setSize(newSizeEl);
	    }
	  }, {
	    key: 'selectSizeByElement',
	    value: function selectSizeByElement(newSizeEl) {
	      this.size = _maps.sizeMap[_maps.sizeMap[size.classList[1].replace('size-', '')]];

	      this._setSize(newSizeEl);
	    }

	    // Private

	  }, {
	    key: '_setSize',
	    value: function _setSize(newSizeEl) {
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

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Marker).call(this, 'marker', (0, _domNodes.getToolElement)('marker'), color, sizeIndex));

	    _this2.selectSizeByElement = _this2.selectSizeByElement.bind(_this2);
	    _this2.selectColorByName = _this2.selectColorByName.bind(_this2);
	    return _this2;
	  }

	  _createClass(Marker, [{
	    key: 'selectColorByElement',
	    value: function selectColorByElement(colorEl) {
	      var previousColor = this.color;
	      this.color = _maps.colorMap[colorEl.classList[1]];
	    }
	  }, {
	    key: 'selectColorByName',
	    value: function selectColorByName(color) {
	      var previousColor = this.color;
	      this.color = _maps.colorMap[color];
	    }
	  }]);

	  return Marker;
	}(Stroker);

	var Eraser = exports.Eraser = function (_Stroker2) {
	  _inherits(Eraser, _Stroker2);

	  function Eraser(size) {
	    _classCallCheck(this, Eraser);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Eraser).call(this, 'eraser', (0, _domNodes.getToolElement)('eraser'), '#fff', size));
	  }

	  return Eraser;
	}(Stroker);

	var PaletteTool = exports.PaletteTool = function (_Tool2) {
	  _inherits(PaletteTool, _Tool2);

	  function PaletteTool(name) {
	    _classCallCheck(this, PaletteTool);

	    var el = (0, _domNodes.getToolElement)(name);

	    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(PaletteTool).call(this, name, el));

	    _this4.togglePalette = _this4.togglePalette.bind(_this4);
	    return _this4;
	  }

	  _createClass(PaletteTool, [{
	    key: 'setPalette',
	    value: function setPalette(palette) {
	      this.palette = palette;
	    }
	  }, {
	    key: 'togglePalette',
	    value: function togglePalette(currentPalette) {
	      if (!this.palette) {
	        console.error('This tool has no palette yet');
	        return;
	      }
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

	    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Splatter).call(this, 'splatter'));

	    _this5.setBackgroundColor = _this5.setBackgroundColor.bind(_this5);
	    return _this5;
	  }

	  _createClass(Splatter, [{
	    key: 'setBackgroundColor',
	    value: function setBackgroundColor(previousColor, color) {
	      this.el.setAttribute("style", 'background-color: ' + color);

	      // Toggle the border around the black splatter
	      if ((this.color === '#151515' || previousColor === '#151515') && previousColor !== this.color) {
	        this.toggle();
	      }
	    }
	  }]);

	  return Splatter;
	}(PaletteTool);

	var Dots = exports.Dots = function (_PaletteTool2) {
	  _inherits(Dots, _PaletteTool2);

	  function Dots() {
	    _classCallCheck(this, Dots);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Dots).call(this, 'dots'));
	  }

	  return Dots;
	}(PaletteTool);

	var Palette = exports.Palette = function () {
	  function Palette(name) {
	    var toggleable = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    _classCallCheck(this, Palette);

	    this.name = name;
	    this.el = (0, _domNodes.getPaletteElement)(name);
	    this.toggleable = toggleable;

	    this.toggle = this.toggle.bind(this);
	    this.addListeners = this.addListeners.bind(this);
	  }

	  _createClass(Palette, [{
	    key: 'toggle',
	    value: function toggle() {
	      if (!this.toggleable) return;
	      this.el.classList.toggle('open-palette');
	    }
	  }, {
	    key: 'addListeners',
	    value: function addListeners(selectChild) {
	      var _this7 = this;

	      var children = Array.prototype.slice.call(this.el.children);
	      children.forEach(function (child) {
	        child.addEventListener('mousedown', function (e) {
	          selectChild(child);
	          _this7.toggle();
	        });
	      });
	    }
	  }]);

	  return Palette;
	}();

	var ToolPalette = exports.ToolPalette = function (_Palette) {
	  _inherits(ToolPalette, _Palette);

	  function ToolPalette() {
	    _classCallCheck(this, ToolPalette);

	    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(ToolPalette).call(this, 'tool', false));

	    _this8.tools = {};
	    _this8.palettes = {};
	    _this8.selectedTool = null;

	    // Bind all functions
	    _this8.selectToolByElement = _this8.selectToolByElement.bind(_this8);
	    _this8.selectToolByName = _this8.selectToolByName.bind(_this8);

	    _this8.addPalette = _this8.addPalette.bind(_this8);
	    _this8.addTool = _this8.addTool.bind(_this8);
	    _this8.setTool = _this8.setTool.bind(_this8);
	    return _this8;
	  }

	  _createClass(ToolPalette, [{
	    key: 'initialize',
	    value: function initialize() {

	      this.addListeners(this.selectToolByElement);

	      // Add all tools
	      this.addTool(new Splatter());
	      this.addTool(new Marker('gray', 6));
	      this.addTool(new Eraser(6));

	      var _tools = this.tools;
	      var splatter = _tools.splatter;
	      var marker = _tools.marker;
	      var eraser = _tools.eraser;

	      // Add all palettes

	      this.addPalette(new Palette('color'));
	      this.addPalette(new Palette('marker-size'));
	      this.addPalette(new Palette('eraser-size'));

	      debugger;

	      var _palettes = this.palettes;
	      var colorPalette = _palettes.colorPalette;
	      var markerSizePalette = _palettes.markerSizePalette;
	      var eraserSizePalette = _palettes.eraserSizePalette;


	      colorPalette.addListeners(marker.selectColorByElement);
	      markerSizePalette.addListeners(marker.selectSizeByElement);
	      eraserSizePalette.addListeners(eraser.selectSizeByElement);

	      // Set palettes
	      splatter.setPalette(colorPalette);

	      this.selectToolByName('marker');
	    }
	  }, {
	    key: 'selectToolByElement',
	    value: function selectToolByElement(newToolEl) {
	      var name = newToolEl.classList[1];
	      this.selectToolByName(name);
	    }
	  }, {
	    key: 'selectToolByName',
	    value: function selectToolByName(name) {
	      var newTool = this.tools[name];
	      if (!newTool) {
	        console.error('This tool has not yet been added to the canvas');
	        return;
	      }
	      this.setTool(newTool);
	    }
	  }, {
	    key: 'addTool',
	    value: function addTool(tool) {
	      this.tools = Object.assign(_defineProperty({}, tool.name, tool), this.tools);
	    }
	  }, {
	    key: 'addPalette',
	    value: function addPalette(palette) {
	      this.palettes = Object.assign(_defineProperty({}, getPaletteName(palette.name), palette), this.palettes);
	    }
	  }, {
	    key: 'setTool',
	    value: function setTool(newTool) {
	      if (newTool !== this.selectedTool) {
	        newTool.toggle();
	        if (this.selectedTool) {
	          this.selectedTool.toggle();
	        }
	        this.selectedTool = newTool;
	      } // Else set selected tool to null
	    }
	  }]);

	  return ToolPalette;
	}(Palette);

	function getPaletteName(str) {
	  var dashIndex = str.indexOf('-');

	  if (dashIndex > -1) {
	    return str.substring(0, dashIndex) + str.charAt(dashIndex + 1).toUpperCase() + str.substring(dashIndex + 2) + 'Palette';
	  }
	  return str + 'Palette';
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getToolElement = exports.getColorElement = exports.getSizeElement = exports.getPaletteElement = exports.loadingOverlay = exports.board = exports.canvas = exports.toolList = undefined;

	var _maps = __webpack_require__(3);

	var toolList = exports.toolList = document.querySelector('.tool-palette');
	var canvas = exports.canvas = document.getElementById('canvas-main');
	var board = exports.board = document.querySelector('.board');
	var loadingOverlay = exports.loadingOverlay = document.querySelector('.loading-overlay');

	var getPaletteElement = exports.getPaletteElement = function getPaletteElement(name) {
	  return document.querySelector('.' + name + '-palette');
	};

	var getSizeElement = exports.getSizeElement = function getSizeElement(index, name) {
	  if (name === 'marker') {
	    var markerSizePalette = getPaletteElement('marker-size');
	    return markerSizePalette.querySelector('.size-circle.size-' + index);
	  }
	  if (name === 'eraser') {
	    var eraserSizePalette = getPaletteElement('eraser-size');
	    return eraserSizePalette.querySelector('.size-circle.size-' + index);
	  }

	  console.error('[' + name + '] is not a valid tool for getting a size element');
	};

	var getColorElement = exports.getColorElement = function getColorElement(color) {
	  var colorPalette = getPaletteElement('color');
	  return colorPalette.querySelector('.color-box.' + color);
	};

	var getToolElement = exports.getToolElement = function getToolElement(name) {
	  var displayed = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	  return displayed ? toolList.querySelector('.' + name + '.display') : toolList.querySelector('.' + name + '.no-display');
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