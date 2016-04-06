/**
 * Header
 */

import 'colors'

console.log((
    " ______ ___________ _____ _    _  _____  _    _ \n" +
    " |  ___|_   _| ___ \\  ___| |  | ||  _  || |  | |\n" +
    " | |_    | | | |_/ / |__ | |  | || | | || |  | |\n" +
    " |  _|   | | |    /|  __|| |/\\| || | | || |/\\| |\n" +
    " | |    _| |_| |\\ \\| |___\\  /\\  /\\ \\_/ /\\  /\\  /\n" +
    " \\_|    \\___/\\_| \\_\\____/ \\/  \\/  \\___/  \\/  \\/ \n"
).magenta);

/**
 * Check root
 */

import fs from 'fs'
import isRoot from 'is-root'

if (!isRoot()) {
	console.error('> this server requires sudo/root access.'.red);
	process.exit(-1);
} else {
	console.log('> sudo access confirmed.'.green);
}

/**
 * Configuration folder creation
 */

var databaseDirectory = '/etc/firewow';

var stats = null;
try {
    stats = fs.lstatSync(databaseDirectory);
} catch (e) {
    try {
        fs.mkdirSync(databaseDirectory);
    } catch(e) {
		console.error(('Failed to create ' + databaseDirectory).red);
		console.error(e);
		process.exit(-1);
    }
}

/**
 * Imports
 */
import express from 'express'
import path from 'path'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config'

import db from './database.js'
import routes from './routes.js'

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
 * User check
 */
var users = db('users').size();
if (users <= 0) {
    db('users').push({ 'username': 'admin', 'password': 'admin' });
    console.log('> created initial user `admin`'.green);
    users = 1;
}
console.log('> %d users loaded'.blue, users);

var rules = db('rules').size();
console.log('> %d rules loaded'.blue, rules);

/**
 * Serves static files
 */
app.use(express.static(path.resolve(__dirname, "../assets")));

/**
 * Modules
 */
routes(app);

/**
 * Render
 */
app.get('*', function(request, response) {
    response.sendFile(path.join(__dirname, "../assets/index.html"));
});

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
    console.log('');
	console.log(('> firewow admin started ' + (development ? "(development)" : "(production)")).green);
    console.log('');
});
