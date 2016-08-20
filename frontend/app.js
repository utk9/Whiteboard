import {
  Marker,
  Splatter,
  Canvas,
  Palette,
  Eraser,
} from './toolClasses.js'
import {
  splatter,
  getToolElement,
  getPaletteElement,
  getSizeElement
} from './domNodes.js'
import {
  colorMap,
  sizeMap,
} from './maps.js'

document.addEventListener('DOMContentLoaded', function() {
  let canvas = new Canvas()

  let toolPalette = new Palette('tool', canvas.selectToolByElement, false)
  let colorPalette = new Palette('color', marker.selectColorByElement)
  let markerSizePalette = new Palette('marker-size', marker.selectSizeByElement)
  let eraserSizePalette = new Palette('eraser-size', eraser.selectSizeByElement)

  let splatter = new Splatter(colorPalette)

  let marker = new Marker('gray', 5, splatter)
  let eraser = new Eraser(5)

  canvas.addTools([marker, eraser])
  canvas.setTool(marker)

 // // Drawing functionality
 //  canvas.addEventListener('mousemove', function (e) {
 //    draw('move', e);
 //  }, false);

 //  canvas.addEventListener('mousedown', function (e) {
 //    draw('down', e);
 //  }, false);

 //  canvas.addEventListener('mouseup', function (e) {
 //    draw('up', e);
 //  }, false);

 //  canvas.addEventListener('mouseout', function (e) {
 //    draw('out', e);
 //  }, false);
})
