vav mongoose = require('mongoose');

var canvasSchema = new mongoose.Schema({
	name: String,
	password: String,
	canvasInfo: {
		name: String,
		width: Number,
		height: Number,
		strokes: Schema.Types.Mixed
	}
}, { collection: 'canvases' });

var Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = Canvas;