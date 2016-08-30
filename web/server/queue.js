var db = require('./database.js');
var path = require('path');
var nfq = require('nfqueue');
var parser = require('http-string-parser');

var IPv4 = require('./decode/ipv4');
var DNS = require('./decode/dns');

/**
 * Load rules
 */
module.domains = [];
refresh();

/**
 * Domain filter
 */
function domain_filter(name) {
    name = name.toLowerCase();
    for (var index in module.domains) {
        var domain = module.domains[index];
        if (!domain.test) {
            continue;
        }
        if (domain.test(name)) {
            return false;
        }
        /*
        var value = domain.value.toLowerCase();
        if (domain.mode == 'startswith') {
            if (name.startsWith(value)) {
                return false;
            }
        } else if (domain.mode == 'contains') {
            if (name.indexOf(value) !== -1) {
                return false;
            }
        } else if (domain.mode == 'endswith') {
            if (name.endsWith(value)) {
                return false;
            }
        }
        */
    }
    return true;
}

/**
 * Database refresh
 * @return {[type]} [description]
 */
function refresh() {
    module.domains = [];
    var domains = db('domains').toJSON();
    for (var index in domains) {
        var domain = domains[index];
        var expr = '^' + domain.name.split("*").join(".*") + '$';
        module.domains.push(new RegExp(expr));
    }
}

module.exports.refresh = refresh;

/**
 * Http handler
 * @type {[type]}
 */
nfq.createQueueHandler(1, 65535, function(nfpacket) {
    var packet = new IPv4().decode(nfpacket.payload, 0);
    if (packet.payload && packet.payload.data) {
        var data = packet.payload.data.toString();
        var request = parser.parseRequest(data);
        if (request && request.headers && request.headers.Host) {
            if (!domain_filter(request.headers.Host)) {
                console.log('forbidden domain detected - dropping http request');
                return nfpacket.setVerdict(nfq.NF_DROP);
            }
        }
    }
    return nfpacket.setVerdict(nfq.NF_ACCEPT);
});

/**
 * Http handler
 * @type {[type]}
 */
nfq.createQueueHandler(2, 65535, function(nfpacket) {

    var packet = new IPv4().decode(nfpacket.payload, 0);
    if (packet.payload && packet.payload.data) {

        var dns = new DNS().decode(packet.payload.data, 0);
        if (!dns.header) {
            return nfpacket.setVerdict(nfq.NF_ACCEPT);
        }

        if (dns.header.opcode != 0) {
            return nfpacket.setVerdict(nfq.NF_ACCEPT);
        }

        if (dns.question) {
            var rrses = dns.question.rrs;
            for (var rrsidx in rrses) {
                var rrs = rrses[rrsidx];
                if (rrs.is_question && !domain_filter(rrs.name)) {
                    console.log('forbidden domain detected - dropping dns request');
                    return nfpacket.setVerdict(nfq.NF_DROP);
                }
            }
        }
    }
    return nfpacket.setVerdict(nfq.NF_ACCEPT);
});
