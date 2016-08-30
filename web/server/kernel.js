import { exec } from 'child_process'

module.exports = {
    reload: () => {
        exec(__dirname + '/../../kernel/reload.sh',
            function (error, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(error);
                }
            });
    }
}
