var mongoose = require('mongoose');

var canvasSchema = new mongoose.Schema({
	name: String,
	pass: String,
	canvasInfo: {
		name: String,
		width: Number,
		height: Number,
		strokes: mongoose.Schema.Types.Mixed
	}
}, { collection: 'canvases' });

var Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = Canvas;
