"use strict";

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?quiet=true';
var HtmlWebpackPlugin = require('html-webpack-plugin');

var development = true;
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
	development = false;
}

/**
 * Merge
 */

function merge() {
	var retval = {};
	for (var arg in arguments) {
		if (typeof arguments[arg] !== "object") {
			continue;
		}
		for (var attr in arguments[arg]) {
			retval[attr] = JSON.stringify(arguments[arg][attr]);
		}
	}
	return retval;
}

/**
 * Webpack Configuration File
 */

module.exports = {

	/**
	 * Caching enabled
	 */

	cache: true,

	/**
	 * Debug information
	 */

	debug: development,
	devtool: development ? "sourcemap" : undefined,

	/**
	 * Entry point
	 */

	entry: [
		"main": path.join(__dirname, "web/client/client.js")
	],

	/**
	 * Output configuration
	 */

	output: {
		path: path.join(__dirname, "web/assets"),
		publicPath: "/",
		filename: "[name]-[hash].js",
		chunkFilename: "[chunkhash].js"
	},

	/**
	 * Modules
	 */

	module: {

		/**
		 * Setup the loaders based on the file types
		 */

		loaders: [

			/**
			 * Images
			 */

			{test: /\.(png|jpg|jpeg|gif)$/, loader: "url?limit=8192"},

			/**
			 * Stylesheets
			 */

			{test: /\.css$/, loaders: ["style", "css"]},

			/**
			 * Less
			 */

			{test: /\.less$/, loaders: ["style", "css", "less"]},

			/**
			 * Sass
			 */

			{test: /\.scss$/, loaders: ["style", "css", "sass"]},

			/**
			 * Json
			 */

			{test: /\.json$/, loaders: ["json"]},

			/**
			 * React
			 */

			{
				test: /\.jsx?$/,
				loader: "babel",
				exclude: /(node_modules)/
			}
		]
	},

	/**
	 * Resolve path
	 */

	resolve: {
		root: [
			path.join(__dirname, "web/client"),
			path.join(__dirname, "bower_components")
		]
	},

	/**
	 * Plugins
	 */

	plugins: [

		/**
		 * Bower support
		 */
		new webpack.ResolverPlugin(
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
		),

		/**
		 * Fix file watch for updates
		 */
		new webpack.OldWatchingPlugin(),

		/**
		 * Code banner
		 */

		new webpack.BannerPlugin("FireWOW Project"),

		/**
		 * Definitions
		 */

		new webpack.DefinePlugin(merge({
			"DEBUG": JSON.stringify(development),
			"process.env": {
				"NODE_ENV": development ? JSON.stringify("development") : JSON.stringify("production")
			}
		}),

		/**
		 * Resolves a module based on the variable accessed
		 */

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			"React": "react",
			"ReactDOM": "react-dom"
		}),

		/**
		 * Writes the asset manifest file with the current assets version
		 */

		function() {
			this.plugin("done", function(stats) {
				var name = json.assetsByChunkName['main'];
				if (Array.isArray(name)) {
					name = name[0];
				}
				var contents =
					"<!DOCTYPE html>\n" +
					"<html>\n" +
					"	<head>\n" +
					"		<meta charset=\"UTF-8\">\n" +
					"		<title>FireWOW</title>\n" +
					"	</head>\n" +
					"	<body>\n" +
					"		<div id=\"root\"></div>\n" +
					"		<script type=\"text/javascript\" src=\"" + name + "\"></script>\n";
					"	</body>\n" +
					"</html>";

				fs.writeFileSync(
					path.join(__dirname, "web/assets/index.html"), contents
				);
			});
		}
	]
};

/**
 * Adjust
 */
if (development) {

	// Add hot reload middleware to entries
	for (var entry in module.exports.entry) {
		if (Array.isArray(module.exports.entry[entry])) {
			module.exports.entry[entry].push(hotMiddlewareScript);
		} else {
			module.exports.entry[entry] = [module.exports.entry[entry], hotMiddlewareScript]
		}
	}

	module.exports.plugins.unshift(
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	);

} else {

	module.exports.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	);

}
