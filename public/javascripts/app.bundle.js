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

	var _toolPalette = __webpack_require__(1);

	var _domNodes = __webpack_require__(3);

	var _draw = __webpack_require__(5);

	var _canvasData = __webpack_require__(6);

	var socket = void 0,
	    loadingInterval = void 0;

	var url = window.location.href;
	var canvasName = url.substring(url.lastIndexOf('/') + 1);

	var loadingSpinner = document.querySelector('.loading-spinner');

	document.addEventListener('DOMContentLoaded', function () {
	  animateLoading(0);

	  initializeSockets();

	  var toolPalette = new _toolPalette.ToolPalette();

	  setCanvasSize();
	  addCanvasListeners(toolPalette);
	});

	function initializeSockets() {
	  //TODO: Send actual canvasData here
	  socket = io();

	  var canvasData = {
	    name: canvasName,
	    width: screen.width,
	    height: screen.height,
	    strokes: []
	  };

	  socket.emit('new_user', { name: canvasName });

	  socket.on('canvas_redraw', function (canvas) {
	    _domNodes.passModal.classList.remove('show');
	    _domNodes.overlay.classList.add('no-display');

	    console.log(canvas);
	    //TODO: Write an update function for all strokes
	    canvas.strokes.forEach(function (data) {
	      (0, _draw.update)(data);
	    });
	  });

	  socket.on('canvas_update', function (data) {
	    (0, _draw.update)(data);
	  });

	  socket.on('error', function (payload) {
	    console.log(payload);
	  });

	  socket.on('password_required', function () {
	    _domNodes.loadingIcon.classList.add('no-display');
	    _domNodes.passModal.classList.add('show');

	    var submitButton = document.querySelector('#password-submit');
	    var passInput = document.querySelector('#password-input');
	    submitButton.addEventListener('click', function () {
	      socket.emit('new_user', { name: canvasName, pass: passInput.value });
	    });
	  });

	  socket.on('incorrect_password', function () {
	    var errorSpan = document.querySelector('.error');
	    errorSpan.innerHTML = 'Incorrect password. Please try again.';
	  });
	}

	// function setCanvasSize() {
	//   board.width = screen.width;
	//   board.height = screen.height;

	//   canvas.width = board.offsetWidth
	//   canvas.height = board.offsetHeight

	//   cursorCanvas.width = board.offsetWidth
	//   cursorCanvas.height = board.offsetHeight
	// }

	function setCanvasSize() {
	  // board.width = screen.width;
	  // board.height = screen.height;

	  _domNodes.canvas.width = screen.width;
	  _domNodes.canvas.height = screen.height;

	  _domNodes.cursorCanvas.width = screen.width;
	  _domNodes.cursorCanvas.height = screen.height;
	}

	function addCanvasListeners(toolPalette) {
	  _domNodes.cursorCanvas.addEventListener('mousemove', function (e) {
	    var drawData = (0, _draw.mouseMove)(toolPalette.selectedTool, e);
	    emitNewStroke(drawData);
	  });

	  _domNodes.cursorCanvas.addEventListener('mousedown', function (e) {
	    var drawData = (0, _draw.mouseDown)(toolPalette.selectedTool, e);
	    emitNewStroke(drawData);
	  });

	  _domNodes.cursorCanvas.addEventListener('mouseup', function (e) {
	    var drawData = (0, _draw.mouseUp)(toolPalette.selectedTool, e);
	    emitNewStroke(drawData);
	  });

	  _domNodes.cursorCanvas.addEventListener('mouseout', function (e) {
	    (0, _draw.mouseOut)(e);
	  });
	}

	function emitNewStroke(drawData) {
	  if (drawData) {
	    socket.emit('new_stroke', {
	      drawData: drawData,
	      canvasName: canvasName
	    });
	  }
	}

	function animateLoading(n) {
	  loadingInterval = setTimeout(function () {
	    loadingSpinner.setAttribute('style', 'transform: rotate(' + n % 360 + 'deg)');
	    animateLoading(n + 5);
	  }, 18);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ToolPalette = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _maps = __webpack_require__(2);

	var _domNodes = __webpack_require__(3);

	var _tools = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ToolPalette = exports.ToolPalette = function (_Palette) {
	  _inherits(ToolPalette, _Palette);

	  function ToolPalette() {
	    _classCallCheck(this, ToolPalette);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ToolPalette).call(this, 'tool'));

	    _this.tools = {};
	    _this.palettes = {};
	    _this.selectedTool = null;

	    _this.setPalette = _this.setPalette.bind(_this);

	    _this.initialize();
	    return _this;
	  }

	  _createClass(ToolPalette, [{
	    key: 'initialize',
	    value: function initialize() {

	      this.addToolListeners();
	      this.addPaletteListeners();

	      // Add all tools
	      var splatter = new _tools.Splatter();
	      var dots = new _tools.Dots();
	      var marker = new _tools.Marker('gray', 6, splatter);
	      var eraser = new _tools.Eraser(6);
	      var circle = new _tools.Circle();
	      var rectangle = new _tools.Rectangle();

	      this.tools = {
	        splatter: splatter,
	        marker: marker,
	        eraser: eraser,
	        circle: circle,
	        rectangle: rectangle
	      };

	      // Add all palettes
	      var colorPalette = new _tools.Palette('color');
	      var markerSizePalette = new _tools.Palette('marker-size');
	      var eraserSizePalette = new _tools.Palette('eraser-size');

	      this.palettes = {
	        colorPalette: colorPalette,
	        markerSizePalette: markerSizePalette,
	        eraserSizePalette: eraserSizePalette
	      };

	      colorPalette.addListeners(marker.selectColorByElement, this.setPalette);
	      markerSizePalette.addListeners(marker.selectSizeByElement, this.setPalette);
	      eraserSizePalette.addListeners(eraser.selectSizeByElement, this.setPalette);

	      // Set palettes
	      splatter.addPalette(colorPalette);
	      dots.addPalette(markerSizePalette);
	      dots.addPalette(eraserSizePalette);

	      this.selectToolByName('marker');
	    }
	  }, {
	    key: 'selectToolByElement',
	    value: function selectToolByElement(newToolEl) {
	      var name = newToolEl.classList[_maps.NAME_INDEX];
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
	    key: 'selectPaletteByTool',
	    value: function selectPaletteByTool(paletteToolEl) {
	      var name = paletteToolEl.classList[_maps.NAME_INDEX];
	      var paletteName = _maps.paletteMap[name][this.selectedTool.name];
	      var newPalette = this.palettes[paletteName];

	      this.setPalette(newPalette);
	    }
	  }, {
	    key: 'addToolListeners',
	    value: function addToolListeners() {
	      var _this2 = this;

	      var toolChildren = Array.prototype.slice.call(this.el.children, _maps.TOOL_START_INDEX);
	      toolChildren.forEach(function (child) {
	        child.addEventListener('click', function (e) {
	          _this2.selectToolByElement(child);
	        });
	      });
	    }
	  }, {
	    key: 'addPaletteListeners',
	    value: function addPaletteListeners() {
	      var _this3 = this;

	      var paletteChildren = Array.prototype.slice.call(this.el.children, 0, _maps.TOOL_START_INDEX);
	      paletteChildren.forEach(function (child) {
	        child.addEventListener('click', function (e) {
	          _this3.selectPaletteByTool(child);
	        });
	      });
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
	  }, {
	    key: 'setPalette',
	    value: function setPalette(newPalette) {
	      if (!newPalette) {
	        this.selectedPalette = null;
	        return;
	      }

	      newPalette.toggle();
	      if (newPalette !== this.selectedPalette) {
	        if (this.selectedPalette) {
	          this.selectedPalette.toggle();
	        }
	        this.selectedPalette = newPalette;
	      } else {
	        this.selectedPalette = null;
	      }
	    }
	  }]);

	  return ToolPalette;
	}(_tools.Palette);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var sizeMap = exports.sizeMap = [45, 36, 30, 25, 20, 15, 10];

	var colorMap = exports.colorMap = {
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

	var paletteMap = exports.paletteMap = {
	  splatter: {
	    marker: 'colorPalette',
	    eraser: 'colorPalette',
	    circle: 'colorPalette',
	    rectangle: 'colorPalette'
	  },
	  dots: {
	    marker: 'markerSizePalette',
	    eraser: 'eraserSizePalette'
	  }
	};

	var TOOL_START_INDEX = exports.TOOL_START_INDEX = 3;
	var NAME_INDEX = exports.NAME_INDEX = 1;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getToolElement = exports.getColorElement = exports.getSizeElement = exports.getPaletteElement = exports.passModal = exports.loadingIcon = exports.overlay = exports.board = exports.cursorCanvas = exports.canvas = exports.toolList = undefined;

	var _maps = __webpack_require__(2);

	var toolList = exports.toolList = document.querySelector('.tool-palette');
	var canvas = exports.canvas = document.getElementById('canvas-main');
	var cursorCanvas = exports.cursorCanvas = document.getElementById('canvas-cursor');
	var board = exports.board = document.querySelector('.board');
	var overlay = exports.overlay = document.querySelector('.overlay');
	var loadingIcon = exports.loadingIcon = document.querySelector('.loading-icon');
	var passModal = exports.passModal = document.querySelector('.password-modal');

	// TODO: Memoize the values
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Palette = exports.Dots = exports.Splatter = exports.Rectangle = exports.Circle = exports.Eraser = exports.Marker = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _maps = __webpack_require__(2);

	var _domNodes = __webpack_require__(3);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tool = function () {
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

	var Stroker = function (_Tool) {
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
	      this.size = _maps.sizeMap[newSizeEl.classList[_maps.NAME_INDEX].replace('size-', '')];

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

	  function Marker(color, sizeIndex, splatter) {
	    _classCallCheck(this, Marker);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Marker).call(this, 'marker', (0, _domNodes.getToolElement)('marker'), color, sizeIndex));

	    _this2.splatter = splatter;

	    _this2.splatter.setBackgroundColor(null, 'gray');

	    _this2.selectColorByElement = _this2.selectColorByElement.bind(_this2);
	    _this2.selectColorByName = _this2.selectColorByName.bind(_this2);
	    return _this2;
	  }

	  _createClass(Marker, [{
	    key: 'selectColorByElement',
	    value: function selectColorByElement(colorEl) {
	      var previousColor = this.color;
	      this.color = _maps.colorMap[colorEl.classList[_maps.NAME_INDEX]];
	      this.splatter.setBackgroundColor(previousColor, this.color);
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

	var Circle = exports.Circle = function (_Tool2) {
	  _inherits(Circle, _Tool2);

	  function Circle() {
	    _classCallCheck(this, Circle);

	    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, 'circle', (0, _domNodes.getToolElement)('circle')));

	    _this4.shape = null;
	    _this4.setShape = _this4.setShape.bind(_this4);
	    return _this4;
	  }

	  _createClass(Circle, [{
	    key: 'setShape',
	    value: function setShape(x, y, radius) {
	      this.shape = {
	        x: x,
	        y: y,
	        radius: radius
	      };
	    }
	  }]);

	  return Circle;
	}(Tool);

	var Rectangle = exports.Rectangle = function (_Tool3) {
	  _inherits(Rectangle, _Tool3);

	  function Rectangle() {
	    _classCallCheck(this, Rectangle);

	    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Rectangle).call(this, 'rectangle', (0, _domNodes.getToolElement)('rectangle')));

	    _this5.shape = null;
	    _this5.setShape = _this5.setShape.bind(_this5);
	    return _this5;
	  }

	  _createClass(Rectangle, [{
	    key: 'setShape',
	    value: function setShape(x, y, width, height) {
	      this.shape = {
	        x: x,
	        y: y,
	        width: width,
	        height: height
	      };
	    }
	  }]);

	  return Rectangle;
	}(Tool);

	var PaletteTool = function (_Tool4) {
	  _inherits(PaletteTool, _Tool4);

	  function PaletteTool(name) {
	    _classCallCheck(this, PaletteTool);

	    var el = (0, _domNodes.getToolElement)(name);

	    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(PaletteTool).call(this, name, el));

	    _this6.addPalette = _this6.addPalette.bind(_this6);
	    return _this6;
	  }

	  _createClass(PaletteTool, [{
	    key: 'addPalette',
	    value: function addPalette(palette) {
	      this.palette = Object.assign(_defineProperty({}, palette.name, palette), this.palette);
	    }
	  }]);

	  return PaletteTool;
	}(Tool);

	var Splatter = exports.Splatter = function (_PaletteTool) {
	  _inherits(Splatter, _PaletteTool);

	  function Splatter() {
	    _classCallCheck(this, Splatter);

	    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Splatter).call(this, 'splatter'));

	    _this7.setBackgroundColor = _this7.setBackgroundColor.bind(_this7);
	    return _this7;
	  }

	  _createClass(Splatter, [{
	    key: 'setBackgroundColor',
	    value: function setBackgroundColor(previousColor, color) {
	      // Toggle the border around the black splatter
	      if ((color === _maps.colorMap['black'] || previousColor === _maps.colorMap['black']) && previousColor !== color) {
	        this.toggle();
	      }

	      this.el.setAttribute("style", 'background-color: ' + color);
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
	    _classCallCheck(this, Palette);

	    this.name = name;
	    this.el = (0, _domNodes.getPaletteElement)(name);

	    this.toggle = this.toggle.bind(this);
	    this.addListeners = this.addListeners.bind(this);
	  }

	  _createClass(Palette, [{
	    key: 'toggle',
	    value: function toggle() {
	      this.el.classList.toggle('open-palette');
	    }
	  }, {
	    key: 'addListeners',
	    value: function addListeners(selectChild, setPalette) {
	      var _this9 = this;

	      var children = Array.prototype.slice.call(this.el.children);
	      children.forEach(function (child) {
	        child.addEventListener('click', function (e) {
	          selectChild(child);
	          _this9.toggle();
	          setPalette(null);
	        });
	      });
	    }
	  }]);

	  return Palette;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mouseOut = exports.mouseUp = exports.mouseMove = exports.mouseDown = undefined;
	exports.update = update;

	var _domNodes = __webpack_require__(3);

	var _canvasData = __webpack_require__(6);

	var _maps = __webpack_require__(2);

	var ctx = _domNodes.canvas.getContext('2d');
	var cursorCtx = _domNodes.cursorCanvas.getContext('2d');

	var drawing = false;
	var prevPos = { x: 0, y: 0 };
	var curPos = { x: 0, y: 0 };

	var mouseDown = exports.mouseDown = function mouseDown(selectedTool, e) {

	  setCurrentPos(e);
	  drawing = true;

	  var name = selectedTool.name;

	  switch (name) {
	    // Draw the first dot
	    case 'marker':
	    case 'eraser':
	      ctx.beginPath();
	      ctx.fillStyle = selectedTool.color;
	      ctx.arc(curPos.x, curPos.y, selectedTool.size / 2, 0, 2 * Math.PI);
	      ctx.fill();
	      ctx.closePath();

	      return {
	        toolAttributes: selectedTool,
	        points: [curPos]
	      };
	    default:
	      return;
	  }
	};

	var mouseMove = exports.mouseMove = function mouseMove(selectedTool, e) {
	  var name = selectedTool.name;

	  switch (name) {
	    case 'marker':
	    case 'eraser':

	      // Draw the cursor
	      cursorCtx.clearRect(0, 0, _domNodes.cursorCanvas.width, _domNodes.cursorCanvas.height);
	      cursorCtx.beginPath();
	      cursorCtx.arc(getCurPos(e).x, getCurPos(e).y, selectedTool.size / 2, 0, 2 * Math.PI);
	      cursorCtx.stroke();
	      cursorCtx.closePath();

	      if (!drawing) return;

	      setPrevPos();
	      setCurrentPos(e);
	      stroke(selectedTool);
	      return {
	        toolAttributes: selectedTool,
	        points: [prevPos, curPos]
	      };

	    case 'circle':
	      if (!drawing) return;

	      var sideX = Math.abs(getCurPos(e).x - curPos.x);
	      var sideY = Math.abs(getCurPos(e).y - curPos.y);
	      var minSideLength = Math.min(sideX, sideY);

	      var centerX = curPos.x + minSideLength / 2;
	      var centerY = curPos.y + minSideLength / 2;
	      var radius = minSideLength / 2;

	      cursorCtx.clearRect(0, 0, _domNodes.cursorCanvas.width, _domNodes.cursorCanvas.height);
	      cursorCtx.beginPath();
	      cursorCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	      cursorCtx.stroke();
	      cursorCtx.closePath();

	      selectedTool.setShape(centerX, centerY, radius);
	      return;

	    case 'rectangle':
	      if (!drawing) return;

	      var width = getCurPos(e).x - curPos.x;
	      var height = getCurPos(e).y - curPos.y;

	      cursorCtx.clearRect(0, 0, _domNodes.cursorCanvas.width, _domNodes.cursorCanvas.height);

	      cursorCtx.beginPath();
	      cursorCtx.rect(curPos.x, curPos.y, width, height);
	      cursorCtx.stroke();
	      cursorCtx.closePath();

	      selectedTool.setShape(curPos.x, curPos.y, width, height);
	      return;

	    default:
	      return;
	  }
	};

	var mouseUp = exports.mouseUp = function mouseUp(selectedTool, e) {
	  if (!drawing) return;
	  drawing = false;

	  var name = selectedTool.name;
	  var shape = selectedTool.shape;

	  switch (name) {
	    case 'circle':
	      cursorCtx.clearRect(0, 0, _domNodes.cursorCanvas.width, _domNodes.cursorCanvas.height);

	      ctx.beginPath();
	      ctx.lineWidth = 2;
	      ctx.strokeStyle = _maps.colorMap['black'];

	      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
	      ctx.stroke();
	      ctx.closePath();

	      return {
	        toolAttributes: selectedTool,
	        shape: shape
	      };

	    case 'rectangle':
	      cursorCtx.clearRect(0, 0, _domNodes.cursorCanvas.width, _domNodes.cursorCanvas.height);

	      ctx.beginPath();
	      ctx.lineWidth = 2;
	      ctx.strokeStyle = _maps.colorMap['black'];

	      ctx.rect(shape.x, shape.y, shape.width, shape.height);
	      ctx.stroke();
	      ctx.closePath();

	      return {
	        toolAttributes: selectedTool,
	        shape: shape
	      };
	    default:
	      return;
	  }
	};

	var mouseOut = exports.mouseOut = function mouseOut(e) {
	  drawing = false;
	  cursorCtx.clearRect(0, 0, _domNodes.canvas.width, _domNodes.canvas.height);
	};

	function getCurPos(e) {
	  return {
	    x: e.clientX - _domNodes.canvas.offsetLeft,
	    y: e.clientY - _domNodes.canvas.offsetTop
	  };
	}

	function setPrevPos() {
	  prevPos.x = curPos.x;
	  prevPos.y = curPos.y;
	}

	function setCurrentPos(e) {
	  curPos.x = e.clientX - _domNodes.canvas.offsetLeft;
	  curPos.y = e.clientY - _domNodes.canvas.offsetTop;
	}

	function stroke(selectedTool) {
	  ctx.beginPath();

	  ctx.lineWidth = selectedTool.size;
	  ctx.strokeStyle = selectedTool.color;

	  ctx.lineJoin = ctx.lineCap = 'round';
	  ctx.moveTo(prevPos.x, prevPos.y);
	  ctx.lineTo(curPos.x, curPos.y);

	  ctx.stroke();
	  ctx.closePath();
	}

	function update(data) {

	  var toolAttributes = data.toolAttributes;
	  var points = data.points;

	  var prevPos = void 0,
	      curPos = void 0;
	  if (points) {
	    prevPos = data.points[0];
	    curPos = data.points[1];
	  }

	  var name = toolAttributes.name;
	  var shape = toolAttributes.shape;

	  switch (name) {
	    case 'marker':
	    case 'eraser':
	      if (!curPos) {
	        ctx.beginPath();
	        ctx.fillStyle = toolAttributes.color;
	        ctx.arc(prevPos.x, prevPos.y, toolAttributes.size / 2, 0, 2 * Math.PI);
	        ctx.fill();
	        ctx.closePath();
	      } else {
	        ctx.beginPath();

	        ctx.lineWidth = toolAttributes.size;
	        ctx.strokeStyle = toolAttributes.color;

	        ctx.lineJoin = ctx.lineCap = 'round';
	        ctx.moveTo(prevPos.x, prevPos.y);
	        ctx.lineTo(curPos.x, curPos.y);

	        ctx.stroke();
	        ctx.closePath();
	      }
	      return;

	    case 'circle':
	      ctx.beginPath();
	      ctx.lineWidth = 2;
	      ctx.strokeStyle = _maps.colorMap['black'];

	      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
	      ctx.stroke();
	      ctx.closePath();
	      return;

	    case 'rectangle':
	      ctx.beginPath();
	      ctx.lineWidth = 2;
	      ctx.strokeStyle = _maps.colorMap['black'];

	      ctx.rect(shape.x, shape.y, shape.width, shape.height);
	      ctx.stroke();
	      ctx.closePath();
	      return;

	    default:
	      return;
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var canvasData = exports.canvasData = {
	  name: '',
	  width: 0,
	  height: 0,
	  strokes: []
	};

/***/ }
/******/ ]);