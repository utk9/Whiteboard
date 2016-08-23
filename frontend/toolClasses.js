import { colorMap, sizeMap, paletteMap } from './maps'

import {
  splatter,
  getToolElement,
  getPaletteElement,
  getSizeElement,
} from './domNodes'

const TOOL_START_INDEX = 3
const NAME_INDEX = 1

export class Tool {
  constructor(name, el) {
    this.name = name
    this.el = el

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    const elToDisplay = getToolElement(this.name, false)

    this.el.classList.remove('display')
    this.el.classList.add('no-display')

    elToDisplay.classList.remove('no-display')
    elToDisplay.classList.add('display')

    this.el = elToDisplay
  }
}

export class Stroker extends Tool {
  constructor(name, el, color, sizeIndex) {
    super(name, el)

    this.color = color
    this.size = sizeMap[sizeIndex]
    this.sizeEl = getSizeElement(sizeIndex, name)
    this.sizeEl.classList.toggle('selected')

    this.selectSizeByIndex = this.selectSizeByIndex.bind(this)
    this.selectSizeByElement = this.selectSizeByElement.bind(this)
  }
  selectSizeByIndex(sizeIndex) {
    if (sizeIndex > sizeMap.length - 1) {
      console.error('sizeIndex is not valid')
    }
    this.size = sizeMap[sizeIndex]

    let newSizeEl = getSizeElement(sizeIndex, this.name)
    this._setSize(newSizeEl)
  }

  selectSizeByElement(newSizeEl) {
    this.size = sizeMap[sizeMap[size.classList[NAME_INDEX].replace('size-', '')]]

    this._setSize(newSizeEl)
  }

  // Private
  _setSize(newSizeEl) {
    newSizeEl.classList.toggle('selected')
    if (this.sizeEl) {
      this.sizeEl.classList.toggle('selected')
    }
    this.sizeEl = newSizeEl
  }
}

export class Marker extends Stroker {
  constructor(color, sizeIndex) {
    super('marker', getToolElement('marker'), color, sizeIndex)

    this.selectSizeByElement = this.selectSizeByElement.bind(this)
    this.selectColorByName = this.selectColorByName.bind(this)
  }

  selectColorByElement(colorEl) {
    const previousColor = this.color
    this.color = colorMap[colorEl.classList[NAME_INDEX]]
  }

  selectColorByName(color) {
    const previousColor = this.color
    this.color = colorMap[color]
  }
}

export class Eraser extends Stroker {
  constructor(size) {
    super('eraser', getToolElement('eraser'), '#fff', size)
  }
}

export class PaletteTool extends Tool {
  constructor(name) {
    const el = getToolElement(name)
    super(name, el)

    this.addPalette = this.addPalette.bind(this)
  }

  addPalette(palette) {
    this.palette = Object.assign({ [palette.name]: palette }, this.palette)
  }
}

export class Splatter extends PaletteTool {
  constructor() {
    super('splatter')

    this.setBackgroundColor = this.setBackgroundColor.bind(this)
  }

  setBackgroundColor(previousColor, color) {
    this.el.setAttribute("style", `background-color: ${color}`)

    // Toggle the border around the black splatter
    if ((this.color === '#151515' || previousColor === '#151515')
      && previousColor !== this.color) {
      this.toggle()
    }
  }
}

export class Dots extends PaletteTool {
  constructor() {
    super('dots')
  }
}

export class Palette {
  constructor(name) {
    this.name = name
    this.el = getPaletteElement(name)

    this.toggle = this.toggle.bind(this)
    this.addListeners = this.addListeners.bind(this)
  }

  toggle() {
    this.el.classList.toggle('open-palette')
  }

  addListeners(selectChild) {
    const children = Array.prototype.slice.call(this.el.children)
    children.forEach((child) => {
      child.addEventListener('click', (e) => {
        selectChild(child)
        this.toggle()
      })
    })
  }
}

export class ToolPalette extends Palette {
  constructor() {
    super('tool')

    this.tools = {}
    this.palettes = {}
    this.selectedTool = null

    this.initialize()
  }

  initialize() {

    this.addToolListeners()
    this.addPaletteListeners()

    // Add all tools
    const splatter = new Splatter()
    const dots = new Dots()
    const marker = new Marker('gray', 6)
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

    colorPalette.addListeners(marker.selectColorByElement)
    markerSizePalette.addListeners(marker.selectSizeByElement)
    eraserSizePalette.addListeners(eraser.selectSizeByElement)

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

  // Private
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
