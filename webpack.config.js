"use strict";

/**
 * Development check
 */
var development = false;
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
	development = true;
}

/**
 * Imports
 */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?quiet=true';
var HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Configuration File
 */

module.exports = {

	/**
	 * Caching enabled
	 */

	cache: true,

	/**
	 * Context
	 */
	context: __dirname,

	/**
	 * Debug information
	 */

	debug: development,
	devtool: development ? "sourcemap" : undefined,

	/**
	 * Entry point
	 */

	entry: {
		"main": path.join(__dirname, "web/client/client.js")
	},

	/**
	 * Output configuration
	 */

	output: {
		path: path.join(__dirname, "web/assets"),
		filename: "[name]-[hash].js",
		chunkFilename: "[chunkhash].js",
		publicPath: "/"
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
		 * Fonts
		 */

			{test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=512&mimetype=application/font-woff"},
			{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=512&mimetype=application/octet-stream"},
			{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/i, loader: "file"},
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=512&mimetype=image/svg+xml"},

		/**
		 * Images
		 */

			{test: /\.(png|jpe?g|gif)$/i, loader: "url?limit=512"},
			{test: /\.svg$/i, loader: "url?limit=512&mimetype=image/svg+xml"},

		/**
		 * Stylesheets
		 */

			{test: /\.css$/i, loaders: ["style", "css"]},

		/**
		 * Less
		 */

			{test: /\.less$/i, loaders: ["style", "css", "less"]},

		/**
		 * Sass
		 */

			{test: /\.scss$/i, loaders: ["style", "css", "sass"]},

		/**
		 * Json
		 */
			{test: /\.json$/i, loader: "json"},

		/**
		 * React
		 */

			{
				test: /\.jsx?$/i,
				loaders: ["react-hot", "babel"],
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
		],
		alias: {
			"jQuery": "jquery"
		}
	},

	sassLoader: {
		includePaths: [
			path.resolve(__dirname, "./node_modules"),
			path.resolve(__dirname, "./bower_components"),
			path.resolve(__dirname, "./web/client/styles")
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

		new webpack.BannerPlugin("FireWOW"),

	/**
	 * Definitions
	 */

		new webpack.DefinePlugin({
			"DEBUG": development,
			"process.env": {
				"NODE_ENV": development ? JSON.stringify("development") : JSON.stringify("production")
			}
		}),

	/**
	 * Resolves a module based on the variable accessed
	 */

		new webpack.ProvidePlugin({
			$: "jquery",
			"jQuery": "jquery",
			"window.jQuery": "jquery",
			"React": "react",
			"ReactDOM": "react-dom"
		}),

		/**
		 * Writes the asset manifest file with the current assets version
		 */

		function() {
			this.plugin("done", function(stats) {

				var name = '';
				var json = stats.toJson();
				var name = json.assetsByChunkName['main'];
				if (Array.isArray(name)) {
					name = name[0];
				}

				var contents =
					"<!DOCTYPE html>\n" +
					"<html lang=\"pt-br\">\n" +
					"	<head>\n" +
					"		<meta charset=\"UTF-8\">\n" +
					"		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
					"		<title>FireWOW</title>\n" +
					//"		<script src=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.js\"></script>" +
					//"		<script src=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.js\"></script>" +
					"	</head>\n" +
					"	<body>\n" +
					"		<div id=\"root\"></div>\n" +
					"		<script type=\"text/javascript\" src=\"/" + name + "\"></script>\n" +
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
			module.exports.entry[entry].unshift(hotMiddlewareScript);
		} else {
			module.exports.entry[entry] = [hotMiddlewareScript, module.exports.entry[entry]]
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
			sourceMap: false,
			compress: {
				warnings: false,
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true
			},
			mangle: {
				except: ['$super', '$', 'exports', 'require']
			},
			output: {
				comments: false
			}
		})
	);

}
