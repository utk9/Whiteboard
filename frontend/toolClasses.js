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
  }
  selectSizeWithIndex(sizeIndex) {
    if (sizeIndex > sizeMap.length - 1) {
      console.error('sizeIndex is not valid')
    }
    this.size = sizeMap[sizeIndex]

    let newSizeEl = getSizeElement(sizeIndex, this.name)
    this.setSize(newSizeEl)
  }

  selectSizeWithElement(newSizeEl) {
    this.size = sizeMap[sizeMap[size.classList[1].replace('size-', '')]]

    this.setSize(newSizeEl)
  }

  // Private
  setSize(newSizeEl) {
    newSizeEl.classList.toggle('selected')
    if (this.sizeEl) {
      this.sizeEl.classList.toggle('selected')
    }
    this.sizeEl = newSizeEl
  }
}

export class Marker extends Stroker {
  constructor(color, sizeIndex, splatter) {
    super('marker', getToolElement('marker'), color, sizeIndex)
    this.splatter = splatter
    this.splatter.setBackgroundColor(color)
  }

  selectColorWithElement(colorEl) {
    const previousColor = this.color
    this.color = colorMap[colorEl.classList[1]]
    this.configureSplatter(previousColor)
  }

  selectColorWithName(color) {
    const previousColor = this.color
    this.color = colorMap[color]
    this.configureSplatter(previousColor)
  }

  // Private
  configureSplatter(previousColor) {
    this.splatter.setBackgroundColor(this.color)

    // Toggle the border around the black splatter
    if ((this.color === '#151515' || previousColor === '#151515')
      && previousColor !== this.color) {
      this.splatter.toggle()
    }
  }
}

export class Eraser extends Stroker {
  constructor(size) {
    super('eraser', getToolElement('eraser'), '#fff', size)
  }
}

export class PaletteTool extends Tool {
  constructor(name, palette) {
    const el = getToolElement(name)
    super(name, el)

    this.palette = palette
  }
  togglePalette(currentPalette) {
    this.palette.toggle()
    if (currentPalette !== this.palette) {
      currentPalette.toggle()
    }
  }
}

export class Splatter extends PaletteTool {
  constructor() {
    let palette = new Palette('color')
    super('splatter', palette)
  }
  setBackgroundColor(color) {
    this.el.setAttribute("style", `background-color: ${color}`)
  }
}

export class Palette {
  constructor(name, selectChild, toggleable) {
    this.name = name
    this.el = getPaletteElement(name)
    this.children = Array.prototype.slice.call(this.el.children)
    this.addListeners(selectChild)
    this.toggleable = toggleable
  }
  toggle() {
    if (!this.toggleable) return
    this.el.classList.toggle('open-palette')
  }
  addListeners(selectChild) {
    this.children.forEach(function(child) {
      child.addEventListener('mousedown', function (e) {
        selectChild(child)
        this.toggle()
      })
    })
  }
}

export class Canvas {
  constructor() {
    this.tools = {}
    this.selectedTool = null
  }
  selectToolWithElement(newToolEl) {
    const name = newToolEl.classList[1]
    debugger
    this.selectToolWithName(name)
  }
  selectToolWithName(name) {
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
  addTools(tools) {
    debugger
    tools.forEach((tool) => {
      this.addTool(tool)
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
}
