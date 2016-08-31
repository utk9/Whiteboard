import { ToolPalette } from './toolPalette'
import { canvas, cursorCanvas, loadingOverlay, board } from './domNodes'
import { mouseMove, mouseDown, mouseUp, mouseOut } from './draw'
import { canvasData } from './canvasData'

let socket

document.addEventListener('DOMContentLoaded', function() {
  initializeSockets()

  const toolPalette = new ToolPalette()

  setCanvasSize()
  addCanvasListeners(toolPalette)

})

function initializeSockets() {
  //TODO: Send actual canvasData here
  socket = io()
  socket.emit("new_user", canvasData)

  socket.on("canvas_redraw", function(canvas) {
    loadingOverlay.classList.add("no-display")
  })

  socket.on("canvas_update", function(data) {
    update(data.points[0], data.points[1], data.toolAttributes)
  })
}

function setCanvasSize() {
  canvas.width = board.offsetWidth
  canvas.height = board.offsetHeight

  cursorCanvas.width = board.offsetWidth
  cursorCanvas.height = board.offsetHeight
}

function addCanvasListeners(toolPalette) {
  cursorCanvas.addEventListener('mousemove', function(e) {
    const drawData = mouseMove(toolPalette.selectedTool, e)

    if (drawData) {
      socket.emit("new_stroke", drawData)
    }
  })

  cursorCanvas.addEventListener('mousedown', function(e) {
    const drawData = mouseDown(toolPalette.selectedTool, e)

    if (drawData) {
      socket.emit("new_stroke", drawData)
    }
  })

  cursorCanvas.addEventListener('mouseup', function(e) {
    mouseUp(e)
  })

  cursorCanvas.addEventListener('mouseout', function(e) {
    mouseOut(e)
  })
}
