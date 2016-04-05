import db from './database.js'

export default function(app) {
    /**
     * Rules list
     */
    app.get('/rules/fetch', function(request, response) {
        response.json([
            { id: 0, action: 'block', proto: 'tcp', src_addr: '127.0.0.1', src_port: 5000, dst_addr: '127.0.0.1', dst_port: 5000, direction: 'all' }
        ]);
    });

}
