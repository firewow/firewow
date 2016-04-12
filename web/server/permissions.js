import fs from 'fs'

var databaseDirectory   = '/etc/firewow';
var rulesPath           = '/etc/firewow/rules';
var databasePath        = '/etc/firewow/database';

/**
 * Create directory
 */
function scriptsPermissions() {
    var scripts = ['build.sh', 'clean.sh', 'logs.sh', 'reload.sh'];
    for (var index in scripts) {
        var script = scripts[index];
        try {
            fs.chmodSync(__dirname + '/../../kernel/' + script, '755');
        } catch(e) {
            console.error('Script chmod failed for '.red + script.red.bold);
        }
    }
    return false;
}

/**
 * Create directory
 */
function createDirectory() {
    try {
        fs.mkdirSync(databaseDirectory);
        return true;
    } catch(e) {
        console.error(('Failed to create ' + databaseDirectory).red);
        console.error(e);
        process.exit(-1);
    }
    return false;
}

/**
 * Check directory
 */
function checkDirectory() {
    try {
        var stats = fs.statSync(databaseDirectory);
        if (!stats.isDirectory()) {
            return createDirectory();
        }
    } catch (e) {
        return createDirectory();
    }
    return true;
}

/**
 * Create database
 */
function createDatabase() {
    try {
        fs.writeFileSync(databasePath, "{}");
        return true;
    } catch(e) {
        console.error(('Failed to create ' + databasePath).red);
        console.error(e);
        process.exit(-1);
    }
    return false;
}

/**
 * Check rules file
 */
function checkDatabase() {
    try {
        var stats = fs.statSync(databasePath);
        if (!stats.isFile()) {
            return createDatabase();;
        }
    } catch (e) {
        return createDatabase();
    }
    return true;
}

/**
 * Create rules
 */
function createRules() {
    try {
        fs.writeFileSync(rulesPath, "");
        return true;
    } catch(e) {
        console.error(('Failed to create ' + rulesPath).red);
        console.error(e);
        process.exit(-1);
    }
    return false;
}

/**
 * Check rules file
 */
function checkRules() {
    try {
        var stats = fs.statSync(rulesPath);
        if (!stats.isFile()) {
            return createRules();
        }
    } catch (e) {
        return createRules();
    }
    return true;
}

/**
 * Perform check
 */
checkDirectory();
checkRules();
checkDatabase();
scriptsPermissions();
