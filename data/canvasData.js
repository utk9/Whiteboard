let canvasMap = new Object();

let Point = function (x, y) {
	this.x = x;
	this.y = y;
}

let Canvas = function (name, width, height, strokes) {
	this.name = name;
	this.width = width;
	this.height = height;
	this.strokes = strokes;

}

module.exports = {
	canvasMap: canvasMap,
	Canvas: Canvas,
	Point: Point
}
