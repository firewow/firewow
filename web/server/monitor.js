import sio from 'socket.io'
import { exec } from 'child_process'
import interfaces from 'interfaces'

var io = null;

var bandwidth = {

};

/**
 * Monitor
 */

setInterval(function monitor() {

    var ifs = interfaces();

    var todelete = [];
    for (var index in bandwidth) {
        if (!(index in ifs)) {
            todelete.push(index);
        }
    }

    todelete.map(function(value) {
        if (value in bandwidth) {
            delete bandwidth[value];
        }
    });

    for (var index in ifs) {

        var iface = ifs[index];

        if (!(index in bandwidth)) {
            bandwidth[index] = {
                tx: 0,
                tx_total: 0,
                rx: 0,
                rx_total: 0
            };
        }

        (function(iface) {
            exec('ifconfig ' + iface, function(err, stdout, stderr) {
                var reg = /RX bytes:(\d+).*TX bytes:(\d+).*/g;
                var match = reg.exec(stdout);
                if (match) {
                    if (bandwidth[iface].rx_total == 0) {
                        bandwidth[iface].rx = 0;
                    } else {
                        bandwidth[iface].rx = parseInt(match[1]) - bandwidth[iface].rx_total;
                    }

                    if (bandwidth[iface].tx_total == 0) {
                        bandwidth[iface].tx = 0;
                    } else {
                        bandwidth[iface].tx = parseInt(match[2]) - bandwidth[iface].tx_total;
                    }

                    bandwidth[iface].rx_total = parseInt(match[1]);
                    bandwidth[iface].tx_total = parseInt(match[2]);

                }
            });
        })(index);

    }

    if (io != null) {
        io.emit('bw', bandwidth);
    }

}, 1000);

/**
 * Websocket module
 */
export default function(app) {

    /**
     * IO Instance
     */
    io = sio(app);

    /**
     * Websocket
     */
    io.on('connection', function(socket) {
        console.log('websocket connection received');
    });

};
