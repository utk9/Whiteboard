import { ToolPalette } from './toolPalette'
import { canvas, cursorCanvas, loadingOverlay, board } from './domNodes'
import { mouseMove, mouseDown, mouseUp, mouseOut, update } from './draw'
import { canvasData } from './canvasData'

let socket
const url = window.location.href
const canvasName = url.substring(url.lastIndexOf('/') + 1)

document.addEventListener('DOMContentLoaded', function() {
  initializeSockets()

  const toolPalette = new ToolPalette()

  setCanvasSize()
  addCanvasListeners(toolPalette)

})

function initializeSockets() {
  //TODO: Send actual canvasData here
  socket = io()

  socket.emit("new_user", {
    name: canvasName,
    width: screen.width,
    height: screen.height,
    strokes: [],
  })

  socket.on("canvas_redraw", function(canvas) {
    loadingOverlay.classList.add("no-display")
    console.log(canvas)

    //TODO: Write an update function for all strokes
    canvas.strokes.forEach(function(data) {
      update(data.points[0], data.points[1], data.toolAttributes)
    })
  })

  socket.on("canvas_update", function(data) {
    update(data.points[0], data.points[1], data.toolAttributes)
  })

  socket.on("error", function(payload) {
    console.log(payload)
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
      socket.emit("new_stroke", {
        drawData,
        canvasName
      })
    }
  })

  cursorCanvas.addEventListener('mousedown', function(e) {
    const drawData = mouseDown(toolPalette.selectedTool, e)

    if (drawData) {
      socket.emit("new_stroke", {
        drawData,
        canvasName
      })
    }
  })

  cursorCanvas.addEventListener('mouseup', function(e) {
    mouseUp(e)
  })

  cursorCanvas.addEventListener('mouseout', function(e) {
    mouseOut(e)
  })
}
