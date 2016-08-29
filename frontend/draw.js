import { canvas, cursorCanvas } from './domNodes'
import { canvasData } from './canvasData'
import { colorMap } from './maps'

const ctx = canvas.getContext('2d')
const cursorCtx = cursorCanvas.getContext('2d')

let drawing = false
let prevPos = { x: 0, y: 0 }
let curPos = { x: 0, y: 0 }

export const mouseDown = function(selectedTool, e) {

  setCurrentPos(e)
  drawing = true

  const name = selectedTool.name

  switch (name) {
    // Draw the first dot
    case 'marker':
    case 'eraser':
      ctx.beginPath()
      ctx.fillStyle = selectedTool.color
      ctx.arc(curPos.x, curPos.y, selectedTool.size/2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()

      return {
        toolAttributes: selectedTool,
        points: [curPos],
      }
    default:
      return
  }

}

export const mouseMove = function(selectedTool, e) {
  const name = selectedTool.name

  switch (name) {
    case 'marker':
    case 'eraser':

      // Draw the cursor
      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)
      cursorCtx.beginPath()
      cursorCtx.arc(getCurPos(e).x, getCurPos(e).y, selectedTool.size/2, 0, 2 * Math.PI)
      cursorCtx.stroke()
      cursorCtx.closePath()

      if (!drawing) return

      setPrevPos()
      setCurrentPos(e)
      stroke(selectedTool)
      return {
        toolAttributes: selectedTool,
        points: [prevPos, curPos],
      }

    case 'circle':
      if (!drawing) return

      const sideX = Math.abs(getCurPos(e).x - curPos.x)
      const sideY = Math.abs(getCurPos(e).y - curPos.y)
      const minSideLength = Math.min(sideX, sideY)

      const centerX = curPos.x + minSideLength / 2
      const centerY = curPos.y + minSideLength / 2
      const radius = minSideLength / 2

      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)
      cursorCtx.beginPath()
      cursorCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      cursorCtx.stroke()
      cursorCtx.closePath()

      selectedTool.setShape(centerX, centerY, radius)
      return

    case 'rectangle':
      if (!drawing) return

      const width = getCurPos(e).x - curPos.x
      const height = getCurPos(e).y - curPos.y

      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)

      cursorCtx.beginPath()
      cursorCtx.rect(curPos.x, curPos.y, width, height)
      cursorCtx.stroke()
      cursorCtx.closePath()

      selectedTool.setShape(curPos.x, curPos.y, width, height)
      return

    default:
      return
  }
}

export const mouseUp = function(selectedTool, e) {
  if (!drawing) return
  drawing = false

  const name = selectedTool.name
  const shape = selectedTool.shape

  switch (name) {
    case 'circle':
      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = colorMap['black']

      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      return {
        toolAttributes: selectedTool,
        canvasName: canvasData.name,
        shape,
      }

    case 'rectangle':
      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = colorMap['black']

      ctx.rect(shape.x, shape.y, shape.width, shape.height)
      ctx.stroke()
      ctx.closePath()

      return {
        toolAttributes: selectedTool,
        canvasName: canvasData.name,
        shape,
      }
    default:
      return
  }
}

export const mouseOut = function(e) {
  drawing = false
  cursorCtx.clearRect(0, 0, canvas.width, canvas.height)
}

function getCurPos(e) {
  return {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop,
  }
}

function setPrevPos() {
  prevPos.x = curPos.x
  prevPos.y = curPos.y
}

function setCurrentPos(e) {
  curPos.x = e.clientX - canvas.offsetLeft
  curPos.y = e.clientY - canvas.offsetTop
}

function stroke(selectedTool) {
  ctx.beginPath()

  ctx.lineWidth = selectedTool.size
  ctx.strokeStyle = selectedTool.color

  ctx.lineJoin = ctx.lineCap = 'round'
  ctx.moveTo(prevPos.x, prevPos.y)
  ctx.lineTo(curPos.x, curPos.y)

  ctx.stroke()
  ctx.closePath()
}

export function update(prevPos, curPos, toolAttributes) {
  if (!curPos) {
    ctx.beginPath()
    ctx.fillStyle = toolAttributes.color
    ctx.arc(prevPos.x, prevPos.y, toolAttributes.size/2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  } else {
    ctx.beginPath()

    ctx.lineWidth = toolAttributes.size
    ctx.strokeStyle = toolAttributes.color

    ctx.lineJoin = ctx.lineCap = 'round'
    ctx.moveTo(prevPos.x, prevPos.y)
    ctx.lineTo(curPos.x, curPos.y)

    ctx.stroke()
    ctx.closePath()
  }
}
