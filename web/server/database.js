import low from 'lowdb'
import storage from 'lowdb/file-sync'
import fs from 'fs'

var databaseDirectory = '/etc/firewow';

var db = null;
try {
	db = low(databaseDirectory + '/db.json', { storage });
} catch (e) {

}

export default db;
