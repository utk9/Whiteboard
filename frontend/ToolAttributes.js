var toolList = require('./domNodes.js').toolList

module.exports.attributes = {
  marker: {
    color: '',
    size: 0,
    sizeElement: null,
  },
  eraser: {
    color: '#fff',
    size: 0,
    sizeElement: null,
  },
};
module.exports.selectedTool = {
  name: '',
  element: null,
};
