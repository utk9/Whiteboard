import { canvas } from './domNodes'
import { canvasData } from './canvasData'

const ctx = canvas.getContext('2d')
let drawing = false
let prevPos = { x: 0, y: 0 }
let curPos = { x: 0, y: 0 }

export const mouseDown = function(selectedTool, e) {
  setCurrentPos(e)
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

      drawing = true
      return {
        toolAttributes: selectedTool,
        canvasName: canvasData.name,
        points: [curPos],
      }
  }

}

export const mouseMove = function(selectedTool, e) {

  const name = selectedTool.name

  switch (name) {
    case 'marker':
    case 'eraser':
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.arc(getCurPos(e).x, getCurPos(e).y, selectedTool.size/2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      if (!drawing) return

      setPrevPos()
      setCurrentPos(e)
      stroke(selectedTool)
      return {
        toolAttributes: selectedTool,
        canvasName: canvasData.name,
        points: [prevPos, curPos],
      }
  }
}

export const mouseUp = function(e) {
  drawing = false
}

export const mouseOut = function(e) {
  drawing = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)
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

function update(prevPos, curPos, toolAttributes) {
  if (prevPos) {
    ctx.beginPath()
    ctx.fillStyle = selectedTool.color
    ctx.arc(curPos.x, curPos.y, selectedTool.size/2, 0, 2 * Math.PI)
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
