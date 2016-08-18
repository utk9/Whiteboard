import {
  paletteMap,
  TOOL_START_INDEX,
  NAME_INDEX,
} from './maps'

import {
  getToolElement,
  getPaletteElement,
  getSizeElement,
} from './domNodes'

import {
  Marker,
  Eraser,
  Splatter,
  Dots,
  Palette,
} from './tools'

export class ToolPalette extends Palette {
  constructor() {
    super('tool')

    this.tools = {}
    this.palettes = {}
    this.selectedTool = null

    this.setPalette = this.setPalette.bind(this)

    this.initialize()
  }

  initialize() {

    this.addToolListeners()
    this.addPaletteListeners()

    // Add all tools
    const splatter = new Splatter()
    const dots = new Dots()
    const marker = new Marker('gray', 6, splatter)
    const eraser = new Eraser(6)

    this.tools = {
      splatter,
      marker,
      eraser,
    }

    // Add all palettes
    const colorPalette = new Palette('color')
    const markerSizePalette = new Palette('marker-size')
    const eraserSizePalette = new Palette('eraser-size')

    this.palettes = {
      colorPalette,
      markerSizePalette,
      eraserSizePalette,
    }

    colorPalette.addListeners(marker.selectColorByElement, this.setPalette)
    markerSizePalette.addListeners(marker.selectSizeByElement, this.setPalette)
    eraserSizePalette.addListeners(eraser.selectSizeByElement, this.setPalette)

    // Set palettes
    splatter.addPalette(colorPalette)
    dots.addPalette(markerSizePalette)
    dots.addPalette(eraserSizePalette)

    this.selectToolByName('marker')
  }

  selectToolByElement(newToolEl) {
    const name = newToolEl.classList[NAME_INDEX]
    this.selectToolByName(name)
  }

  selectToolByName(name) {
    const newTool = this.tools[name]
    if (!newTool) {
      console.error('This tool has not yet been added to the canvas')
      return
    }
    this.setTool(newTool)
  }

  selectPaletteByTool(paletteToolEl) {
    const name = paletteToolEl.classList[NAME_INDEX]
    const paletteName = paletteMap[name][this.selectedTool.name]
    const newPalette = this.palettes[paletteName]

    this.setPalette(newPalette)
  }

  addToolListeners() {
    const toolChildren = Array.prototype.slice.call(this.el.children, TOOL_START_INDEX)
    toolChildren.forEach((child) => {
      child.addEventListener('click', (e) => {
        this.selectToolByElement(child)
      })
    })
  }

  addPaletteListeners() {
    const paletteChildren = Array.prototype.slice.call(this.el.children, 0, TOOL_START_INDEX)
    paletteChildren.forEach((child) => {
      child.addEventListener('click', (e) => {
        this.selectPaletteByTool(child)
      })
    })
  }

  setTool(newTool) {
    if (newTool !== this.selectedTool) {
      newTool.toggle()
      if (this.selectedTool) {
        this.selectedTool.toggle()
      }
      this.selectedTool = newTool
    } // Else set selected tool to null
  }

  setPalette(newPalette) {
    if (!newPalette) {
      this.selectedPalette = null
      return
    }

    newPalette.toggle()
    if (newPalette !== this.selectedPalette) {
      if (this.selectedPalette) {
        this.selectedPalette.toggle()
      }
      this.selectedPalette = newPalette
    } else {
      this.selectedPalette = null
    }
  }
}
