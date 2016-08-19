var canvasMap = new Object();

var Point = function (x, y) {
	this.x = x;
	this.y = y;
}

var CanvasInfo = function (name, width, height, strokes) {
	this.name = name,
	this.width = width,
	this.height = height,
	this.strokes = strokes
}

var Canvas = function (name, pass, canvasInfo) {
	this.name = name;
	this.pass = pass;
	this.canvasInfo = canvasInfo;

}

module.exports = {
	canvasMap: canvasMap,
	Canvas: Canvas,
	CanvasInfo: CanvasInfo,
	Point: Point
}