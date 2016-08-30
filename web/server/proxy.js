import proxy from 'http-proxy'
import db from './database.js'
import http from 'http'
import express from 'express'
import path from 'path'

class Proxy
{
    constructor() {
        this.void = express();
        this.void.use(express.static(path.resolve(__dirname, "forbidden")));
        this.void.use(this.handleVoid);
        this.void_server = http.createServer(this.void);
        this.void_port = 0;

        this.proxy = proxy.createProxyServer({});
        this.proxy_server = http.createServer(this.handleProxy);
        this.proxy_port = 0;
    }

    /**
     * Void handler
     */
    handleVoid = (req, res, next) => {
        res.sendFile(path.resolve(__dirname, "forbidden/index.html"));
        res.end();
    }

    /**
     * Proxy handler
     */
    handleProxy = (req, res) => {

        var ignore1 = 'localhost:' + this.proxy_port;
        var ignore2 = '127.0.0.1:' + this.proxy_port;
        if (req.headers.host == ignore1 || req.headers.host == ignore2) {
            res.end();
            return;
        }

        console.log('filtering request to ' + req.headers.host);
        
        this.proxy.web(req, res, {
            target: 'http://' + req.headers.host + '/'
        });

    }

    /**
     * Listen
     */
    listen(proxy_port, void_port, callback) {

        this.proxy_port = proxy_port;
        this.proxy_server.listen(proxy_port, () => {
            callback('proxy server', proxy_port);
        });

        this.void_port = void_port;
        this.void_server.listen(void_port, () => {
            callback('void server', void_port);
        });

    }

}

export default new Proxy();
