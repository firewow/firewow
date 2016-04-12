import 'colors'
import fs from 'fs'
import db from './database.js'

export default function(app) {
    /**
     * Rules list
     */
    app.get('/rules/fetch', function(request, response) {
        response.json(db("rules").toJSON());
    });

    /**
     * Rules list
     */
    app.post('/rules/flush', function(request, response) {

        if (Array.isArray(request.body)) {
            delete db.object.rules;
            db.write();
            for (var index in request.body) {
                db("rules").push(request.body[index]);
            }
        }

        var rules = db("rules").toJSON();

        var data = '';
        for (var index in rules) {

            var current = rules[index];
            var content = [];

            content.push(current.action);
            content.push(current.direction);
            content.push(current.protocol);

            /**
             * Source address
             */

            if (current.srcaddr_type == 'any') {
                content.push('*');
                content.push('*');
            } else if (current.srcaddr_type == 'single') {
                content.push(current.srcaddr_min);
                content.push('*');
            } else if (current.srcaddr_type == 'range') {
                content.push(current.srcaddr_min);
                content.push(current.srcaddr_max);
            } else {
                content.push('*');
                content.push('*');
                console.error(('unknown value type' + current.srcaddr_type).red);
            }

            /**
             * Source port
             */

            if (current.srcport_type == 'any') {
                content.push('*');
                content.push('*');
            } else if (current.srcport_type == 'single') {
                content.push(current.srcport_min);
                content.push('*');
            } else if (current.srcport_type == 'range') {
                content.push(current.srcport_min);
                content.push(current.srcport_max);
            } else {
                content.push('*');
                content.push('*');
                console.error(('unknown value type' + current.srcport_type).red);
            }

            /**
             * Dest address
             */

            if (current.dstaddr_type == 'any') {
                content.push('*');
                content.push('*');
            } else if (current.dstaddr_type == 'single') {
                content.push(current.dstaddr_min);
                content.push('*');
            } else if (current.dstaddr_type == 'range') {
                content.push(current.dstaddr_min);
                content.push(current.dstaddr_maxn);
            } else {
                content.push('*');
                content.push('*');
                console.error(('unknown value type' + current.dstaddr_type).red);
            }

            /**
             * Dest port
             */

            if (current.dstport_type == 'any') {
                content.push('*');
                content.push('*');
            } else if (current.dstport_type == 'single') {
                content.push(current.dstport_min);
                content.push('*');
            } else if (current.dstport_type == 'range') {
                content.push(current.dstport_min);
                content.push(current.dstport_max);
            } else {
                content.push('*');
                content.push('*');
                console.error(('unknown value type' + current.dstport_type).red);
            }

            data += content.join("\t") + "\n";

        }

        fs.writeFileSync('/etc/firewow/rules', data);
        response.json(db("rules").toJSON());

    });

}
