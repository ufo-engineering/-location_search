const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
	entry: './app/js/map_module_index.js',
	output: {
	  path: path.resolve(__dirname, 'app/js/'),
	  filename: 'map_module_bundle.js'
	},
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /node_modules/, 
	      loader: "babel-loader"
	    }
	  ]
	},
  plugins: [
    new UglifyJsPlugin(), 
	new webpack.LoaderOptionsPlugin({
	  debug: true
	})    
  ]
};