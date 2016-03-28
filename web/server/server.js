/**
 * Imports
 */
import express from 'express'
import path from 'path'

/**
 * Creates the application
 */
var app = express();

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
	console.log('firewow admin started');
});
