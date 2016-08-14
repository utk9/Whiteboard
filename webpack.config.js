module.exports = {
	entry: './frontend/draw.js',
	output: {
		path: './public/javascripts',
		filename: 'app.bundle.js'
	},
	// module: {
	// 	loaders: [{
	// 		test: /\.js$/,
	// 		exclude: /node_modules/,
	// 		loader: 'babel-loader'
	// 	}]
	// }

}