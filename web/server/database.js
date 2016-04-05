import low from 'lowdb'
import storage from 'lowdb/file-sync'
import fs from 'fs'

var databaseDirectory = '/etc/firewow';

var stats = null;

try {
    stats = fs.lstatSync(databaseDirectory);
} catch (e) {
    try {
        fs.mkdirSync(databaseDirectory);
    } catch(e) {
    }
}


const db = low(databaseDirectory + '/db.json', { storage });
export default db;
