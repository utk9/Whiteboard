import { ToolPalette } from './toolClasses.js'
import { canvas } from './domNodes.js'
import { mouseMove, mouseDown } from './draw.js'

let socket

document.addEventListener('DOMContentLoaded', function() {
  // initializeSockets()

  const toolPalette = new ToolPalette()
  const selectedTool = toolPalette.selectedTool

  // addCanvasListeners()

})

function initializeSockets() {
  socket = io()
  socket.emit("new_user", canvasData)

  socket.on("canvas_redraw", function(canvas) {
    loadingOverlay.classList.add("no-display")
  })

  socket.on("canvas_update", function(data) {
    update(data.points[0], data.points[1], data.toolAttributes)
  })
}

function addCanvasListeners() {
  canvas.addEventListener('mousemove', function(e) {
    const drawData = mouseMove(selectedTool, e)

    if (drawData) {
      socket.emit("new_stroke", drawData)
    }
  })

  canvas.addEventListener('mousedown', function(e) {
    const drawData = mouseDown(selectedTool, e)

    if (drawData) {
      socket.emit("new_stroke", drawData)
    }
  })

  canvas.addEventListener('mouseup', function(e) {
    mouseUpAndOut()
  })

  canvas.addEventListener('mouseout', function(e) {
    mouseUpAndOut
  })
}
