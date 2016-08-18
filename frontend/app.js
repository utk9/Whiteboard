import { Marker } from './toolClasses.js'
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
  let marker = new Marker('gray', 5)

  marker.selectSize(6)
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
