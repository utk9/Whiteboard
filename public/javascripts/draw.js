document.addEventListener('DOMContentLoaded', function() {

  var colorMap = {
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
  var sizeMap = [45, 36, 30, 25, 20, 15, 10]

  var canvas = document.getElementById('canvas-main');
  var board = document.querySelector('.board');

  var toolList = document.querySelector('.toolList');

  var splatter = document.querySelector('.splatter');
  var colorPalette = document.querySelector('.color-palette');

  var size = document.querySelector('.size');
  var sizePalette = document.querySelector('.size-palette');


  // Initialize the canvas and draw settings
  setSize();
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;

  var ctx = canvas.getContext('2d');
  var brushWidth = sizeMap[5];
  var prevPos = { x: 0, y: 0 }
  var curPos = { x: 0, y: 0 }

  var drawing = false;

  // Select the default tool, color and size
  var selectedTool, brushColor, brushWidth

  var selectedTool = null;
  var selectedSize = document.querySelector('.size-circle.size-5');
  selectColor(document.querySelector('.color-box.gray'))

  // Adds listeners to select the tool, color, size etc.
  var tools = Array.prototype.slice.call(toolList.children);
  tools.forEach(addToolSelectorListener);

  var colors = Array.prototype.slice.call(colorPalette.children);
  colors.forEach(addColorSelectorListener);

  var sizes = Array.prototype.slice.call(sizePalette.children);
  sizes.forEach(addSizeSelectorListener);

  // Adds listener to open palettes
  var splatters = [document.querySelector('.splatter'), document.querySelector('.splatter.no-display')]
  splatters.forEach(addColorPaletteListener);

  size.addEventListener('mousedown', function(e) {
    sizePalette.classList.toggle('open-palette');
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

      var newTool
      if (tool !== selectedTool) {
        newTool = toggleTool(tool);
        if (selectedTool) {
          toggleTool(selectedTool);
        }
        selectedTool = newTool;
      } else {
        toggleTool(tool);
        selectedTool = null;
      }
    })
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
    var previousColor = brushColor;
    brushColor = colorMap[color.classList[1]];

    // Toggle the border around the black splatter
    if ((brushColor === '#151515' || previousColor === '#151515')
      && previousColor !== brushColor) {
      splatter = toggleTool(splatter);
    }

    splatter.setAttribute("style", `background-color: ${brushColor}`)
  }

  function addSizeSelectorListener(size, index) {
    size.addEventListener('mousedown', function(e) {
      brushWidth = sizeMap[size.classList[1].replace('size-', '')];

      sizePalette.classList.toggle('open-palette')

      size.classList.toggle('selected')
      selectedSize.classList.toggle('selected')
      selectedSize = size;
    });
  }

  function draw(type, e) {

    if (type === 'down') {
      setCurrentPos(e);

      // Draw the first dot
      ctx.beginPath();
      ctx.fillStyle = brushColor;
      ctx.arc(curPos.x, curPos.y, brushWidth/2, 0, 2 * Math.PI);
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

    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = brushColor;

    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(curPos.x, curPos.y);
    ctx.stroke();
    ctx.closePath();
  }
});
