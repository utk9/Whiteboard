document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas-main');
  var board = document.querySelector('.board');
  var toolList = document.querySelector('.toolList');
  var colorList = document.querySelector('.colorList');
  var colorPalette = document.querySelector('.color-palette');
  var splatter = document.querySelector('.splatter');
  var size = document.querySelector('.size');
  var sizePalette = document.querySelector('.size-palette');

  console.log(splatter)

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

  var selectedTool = null;
  var selectedSize = document.querySelector('.size-circle.size-5');
  setSize();

  function setSize() {
    canvas.width = board.offsetWidth;
    canvas.height = board.offsetHeight;
    console.log(canvas.width);
    console.log(canvas.height);
  }

  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var brushWidth = sizeMap[5];
  var brushColor = colorMap[6];
  var drawing = false;
  var prevX = currentX = 0;
  var prevY = currentY = 0;

  ctx.strokeStyle = brushColor;

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


  function toggleTool(tool) {
    // Display the version of the tool that is being hidden and
    // hide the one that is displayed
    var toDisplay = document.querySelector(`.${tool.classList[1]}.no-display`);
    tool.classList.add('no-display');
    toDisplay.classList.remove('no-display');

    return toDisplay
  }

  // Adds listeners to all the tools in the palette
  var tools = Array.prototype.slice.call(toolList.children);
  tools.forEach(addPaletteToolListener);

  function addPaletteToolListener(tool) {
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

  // Adds listener to splatter to open color palette when clicked
  var splatters = Array.prototype.slice.call(colorList.children);
  splatters.forEach(addColorPaletteListener);

  function addColorPaletteListener(splatter) {
    splatter.addEventListener('mousedown', function(e) {
      colorPalette.classList.toggle('open-palette');
    });
  }

  // Adds listeners to all the colors in the color palette
  var colors = Array.prototype.slice.call(colorPalette.children);
  colors.forEach(addColorSelectorListener);

  function addColorSelectorListener(color, index) {
    color.addEventListener('mousedown', function(e) {
      var previousColor = brushColor;
      brushColor = colorMap[color.classList[1]];

      if ((brushColor === '#151515' || previousColor === '#151515')
        && previousColor !== brushColor) {
        splatter = toggleTool(splatter);
      }
      ctx.strokeStyle = brushColor;

      splatter.setAttribute("style", `background-color: ${brushColor}`)
      colorPalette.classList.toggle('open-palette')
    });
  }

  size.addEventListener('mousedown', function(e) {
    sizePalette.classList.toggle('open-palette');
  });

  var sizes = Array.prototype.slice.call(sizePalette.children);
  sizes.forEach(addSizeSelectorListener);

  function addSizeSelectorListener(size, index) {
    size.addEventListener('mousedown', function(e) {
      brushWidth = sizeMap[index];

      sizePalette.classList.toggle('open-palette')

      size.classList.toggle('selected')
      selectedSize.classList.toggle('selected')
      selectedSize = size;
    });
  }

  function draw(type, e) {

    if (type === 'down') {
      setCurrentPos(e);

      ctx.beginPath();
      ctx.fillStyle = brushColor;
      ctx.arc(currentX, currentY, brushWidth/2, 0, 2 * Math.PI);
      ctx.fill();

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
    prevX = currentX;
    prevY = currentY;
  }

  function setCurrentPos(e) {
    currentX = e.clientX - canvas.offsetLeft;
    currentY = e.clientY - canvas.offsetTop;
  }

  function stroke() {
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.closePath();
  }
});
