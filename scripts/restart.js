import { exec } from 'node:child_process';

function startLavamusic() {
    exec('npm start', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting Lavamusic: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`Lavamusic started: ${stdout}`);
    });
}

setTimeout(startLavamusic, 5000);
