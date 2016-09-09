import {
  colorMap,
  sizeMap,
  TOOL_START_INDEX,
  NAME_INDEX,
} from './maps'

import {
  getToolElement,
  getPaletteElement,
  getSizeElement,
} from './domNodes'

class Tool {
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

class Stroker extends Tool {
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
    this.size = sizeMap[newSizeEl.classList[NAME_INDEX].replace('size-', '')]

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
  constructor(color, sizeIndex, splatter) {
    super('marker', getToolElement('marker'), color, sizeIndex)
    this.splatter = splatter

    this.splatter.setBackgroundColor(null, 'gray')

    this.selectColorByElement = this.selectColorByElement.bind(this)
    this.selectColorByName = this.selectColorByName.bind(this)
  }

  selectColorByElement(colorEl) {
    const previousColor = this.color
    this.color = colorMap[colorEl.classList[NAME_INDEX]]
    this.splatter.setBackgroundColor(previousColor, this.color)
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

export class Circle extends Tool {
  constructor() {
    super('circle', getToolElement('circle'))
    this.shape = null
    this.setShape = this.setShape.bind(this)
  }

  setShape(x, y, radius) {
    this.shape = {
      x,
      y,
      radius,
    }
  }
}

export class Rectangle extends Tool {
  constructor() {
    super('rectangle', getToolElement('rectangle'))
    this.shape = null
    this.setShape = this.setShape.bind(this)
  }

  setShape(x, y, width, height) {
    this.shape = {
      x,
      y,
      width,
      height,
    }
  }
}

class PaletteTool extends Tool {
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
    // Toggle the border around the black splatter
    if ((color === colorMap['black'] || previousColor === colorMap['black'])
      && previousColor !== color) {
      this.toggle()
    }

    this.el.setAttribute("style", `background-color: ${color}`)
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

  addListeners(selectChild, setPalette) {
    const children = Array.prototype.slice.call(this.el.children)
    children.forEach((child) => {
      child.addEventListener('click', (e) => {
        selectChild(child)
        this.toggle()
        setPalette(null)
      })
    })
  }
}
