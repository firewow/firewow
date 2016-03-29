/**
 * Imports
 */
import express from 'express'
import path from 'path'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config'

var development = false;
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
   development = true;
}

/**
 * Creates the application
 */
var app = express();

/**
 * Webpack
 */
if (development) {
	var webpackCompiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(webpackCompiler, {
		colors: true,
		publicPath: webpackConfig.output.publicPath
	}));

	app.use(webpackHotMiddleware(webpackCompiler, {

	}));
}

/**
 * Serves static files
 */
app.use(express.static(path.resolve(__dirname, "../assets")));

/**
 * Not found
 */
app.use(function(request, response, next) {
	response.status(404).send('Ops!');
});

/**
 * Listen
 */
app.listen(process.env.FWOW_PORT || 8000, function() {
	console.log('firewow admin started ' + (development ? "(development)" : "(production)"));
});
