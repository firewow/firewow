import './permissions'

import low from 'lowdb'
import storage from 'lowdb/file-sync'
import fs from 'fs'

var databasePath = '/etc/firewow/database';

var db = null;
try {
	db = low(databasePath, { storage });
} catch (e) {
    console.log('database initialization error...'.red);
    console.error(e);
    process.exit(-1);
}

export default db;
