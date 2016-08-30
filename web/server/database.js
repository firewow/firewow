require('./permissions');

var low = require('lowdb');
var storage = require('lowdb/file-sync');
var fs = require('fs');

var databasePath = '/etc/firewow/database';

var db = null;
try {
	db = low(databasePath, { storage });
} catch (e) {
    console.log('database initialization error...'.red);
    console.error(e);
    process.exit(-1);
}

module.exports = db;
