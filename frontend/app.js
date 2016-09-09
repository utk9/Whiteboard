import { ToolPalette } from './toolPalette'
import {
  canvas,
  cursorCanvas,
  overlay,
  board,
  loadingIcon,
  passModal
} from './domNodes'
import {
  mouseMove,
  mouseDown,
  mouseUp,
  mouseOut,
  update
} from './draw'
import { canvasData } from './canvasData'

let socket, loadingInterval

const url = window.location.href
const canvasName = url.substring(url.lastIndexOf('/') + 1)

const loadingSpinner = document.querySelector('.loading-spinner')

document.addEventListener('DOMContentLoaded', function() {
  animateLoading(0)

  initializeSockets()

  const toolPalette = new ToolPalette()

  setCanvasSize()
  addCanvasListeners(toolPalette)

})

function initializeSockets() {
  //TODO: Send actual canvasData here
  socket = io()

  const canvasData = {
    name: canvasName,
    width: screen.width,
    height: screen.height,
    strokes: [],
  }

  socket.emit('new_user', {name: canvasName})

  socket.on('canvas_redraw', function(canvas) {
    passModal.classList.remove('show')
    overlay.classList.add('no-display')

    console.log(canvas)
    //TODO: Write an update function for all strokes
    canvas.strokes.forEach(function(data) {
      update(data)
    })
  })

  socket.on('canvas_update', function(data) {
    update(data)
  })

  socket.on('error', function(payload) {
    console.log(payload)
  })

  socket.on('password_required', function() {
    loadingIcon.classList.add('no-display')
    passModal.classList.add('show')

    const submitButton = document.querySelector('#password-submit')
    const passInput = document.querySelector('#password-input')
    submitButton.addEventListener('click', function() {
      socket.emit('new_user', { name: canvasName, pass: passInput.value })
    })
  })

  socket.on('incorrect_password', function() {
    const errorSpan = document.querySelector('.error')
    errorSpan.innerHTML = 'Incorrect password. Please try again.'
  })
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

  canvas.width = screen.width;
  canvas.height = screen.height;

  cursorCanvas.width = screen.width;
  cursorCanvas.height = screen.height;
}



function addCanvasListeners(toolPalette) {
  debugger
  cursorCanvas.addEventListener('mousemove', function(e) {
    const drawData = mouseMove(toolPalette.selectedTool, e)
    emitNewStroke(drawData)
  })

  cursorCanvas.addEventListener('mousedown', function(e) {
    const drawData = mouseDown(toolPalette.selectedTool, e)
    emitNewStroke(drawData)
  })

  cursorCanvas.addEventListener('mouseup', function(e) {
    const drawData = mouseUp(toolPalette.selectedTool, e)
    emitNewStroke(drawData)
  })

  cursorCanvas.addEventListener('mouseout', function(e) {
    mouseOut(e)
  })
}

function emitNewStroke(drawData) {
  if (drawData) {
    socket.emit('new_stroke', {
      drawData,
      canvasName
    })
  }
}

function animateLoading(n) {
  loadingInterval = setTimeout(function() {
    loadingSpinner.setAttribute('style', `transform: rotate(${n % 360}deg)`)
    animateLoading(n + 5)
  }, 18)
}
