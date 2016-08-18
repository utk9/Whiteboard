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

export class Tool {
  constructor(name, el) {
    this.name = name
    this.el = el
  }

  toggle() {
    var elToDisplay = getToolElement(this.name, false)

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
    debugger
    this.sizeEl = getSizeElement(sizeIndex, name)
  }

  selectSize(sizeIndex) {
    let newSizeEl = getSizeElement(sizeIndex, name)
    debugger
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
  }

  selectColor(colorEl, splatter) {
    const previousColor = this.color
    this.color = colorMap[colorEl.classList[1]]

    // Toggle the border around the black splatter
    if ((this.color === '#151515' || previousColor === '#151515')
      && previousColor !== this.color) {
      splatter.toggle()
    }

    splatter.setBackgroundColor(this.color)
  }
}

export class Eraser extends Stroker {
  constructor(color, size) {
    super('eraser', getToolElement('eraser'), '#fff', size, sizeEl)
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
    this.el.setAttribute("style", `background-color: ${this.color}`)
  }
}

export class Palette {
  constructor(name, selectChild) {
    this.name = name
    this.el = getPaletteElement(name)
    this.children = Array.prototype.slice.call(this.el.children)
    this.addListeners(selectChild)
  }
  toggle() {
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
