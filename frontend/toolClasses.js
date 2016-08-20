import {
  splatter,
  getToolElement,
  getPaletteElement,
  getSizeElement,
} from './domNodes.js'

import {
  colorMap,
  sizeMap,
} from './maps.js'

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
    this.size = sizeMap[sizeMap[size.classList[1].replace('size-', '')]]

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
    this.color = colorMap[colorEl.classList[1]]
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

    this.togglePalette = this.togglePalette.bind(this)
  }

  setPalette(palette) {
    this.palette = palette
  }

  togglePalette(currentPalette) {
    if (!this.palette) {
      console.error('This tool has no palette yet')
      return
    }
    this.palette.toggle()
    if (currentPalette !== this.palette) {
      currentPalette.toggle()
    }
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

  setPalettes(palettes) {
    this.palettes = palettes
  }

  togglePalette(currentPalette) {
    if (!this.palette) {
      console.error('This tool has no palette yet')
      return
    }
    this.palette.toggle()
    if (currentPalette !== this.palette) {
      currentPalette.toggle()
    }
  }
}

export class Palette {
  constructor(name, toggleable=true) {
    this.name = name
    this.el = getPaletteElement(name)
    this.toggleable = toggleable

    this.toggle = this.toggle.bind(this)
    this.addListeners = this.addListeners.bind(this)
  }

  toggle() {
    if (!this.toggleable) return
    this.el.classList.toggle('open-palette')
  }

  addListeners(selectChild) {
    const children = Array.prototype.slice.call(this.el.children)
    children.forEach((child) => {
      child.addEventListener('mousedown', (e) => {
        selectChild(child)
        this.toggle()
      })
    })
  }
}

export class ToolPalette extends Palette {
  constructor() {
    super('tool', false)

    this.tools = {}
    this.palettes = {}
    this.selectedTool = null

    // Bind all functions
    this.selectToolByElement = this.selectToolByElement.bind(this)
    this.selectToolByName = this.selectToolByName.bind(this)

    this.addPalette = this.addPalette.bind(this)
    this.addTool = this.addTool.bind(this)
    this.setTool = this.setTool.bind(this)
  }

  initialize() {

    this.addListeners(this.selectToolByElement)

    // Add all tools
    this.addTool(new Splatter())
    this.addTool(new Marker('gray', 6))
    this.addTool(new Eraser(6))

    const {
      splatter,
      marker,
      eraser,
    } = this.tools

    // Add all palettes
    this.addPalette(new Palette('color'))
    this.addPalette(new Palette('marker-size'))
    this.addPalette(new Palette('eraser-size'))

    const {
      colorPalette,
      markerSizePalette,
      eraserSizePalette,
    } = this.palettes

    colorPalette.addListeners(marker.selectColorByElement)
    markerSizePalette.addListeners(marker.selectSizeByElement)
    eraserSizePalette.addListeners(eraser.selectSizeByElement)

    // Set palettes
    splatter.setPalette(colorPalette)

    this.selectToolByName('marker')
  }

  selectToolByElement(newToolEl) {
    const name = newToolEl.classList[1]
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

  addTool(tool) {
    this.tools = Object.assign({ [tool.name]: tool }, this.tools)
  }

  addPalette(palette) {
    this.palettes = Object.assign({ [getPaletteName(palette.name)]: palette }, this.palettes)
  }

  // Private
  getPaletteName(str) {
    const dashIndex = str.indexOf('-')

    if (dashIndex > -1) {
      return str.substring(0, dashIndex)
        + str.charAt(dashIndex + 1).toUpperCase()
        + str.substring(dashIndex + 2)
        + 'Palette'
    }
    return str + 'Palette'
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
}
