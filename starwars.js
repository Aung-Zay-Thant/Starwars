const { join } = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const readFileAsync = promisify(readFile);
const delay = promisify(setTimeout);

const playMp3 = (filePath) => {
  return new Promise((resolve, reject) => {
    let command;
    if (process.platform === 'win32') {
      command = `start "" "${filePath}"`;
    } else if (process.platform === 'darwin') {
      command = `open "${filePath}"`;
    } else if (process.platform === 'linux') {
      command = `xdg-open "${filePath}"`;
    } else {
      reject(new Error(`Unsupported platform: ${process.platform}`));
      return;
    }

    const childProcess = exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    // Attach the child process to the promise for later cleanup
    resolve(childProcess);
  });
};

const stopMp3 = (childProcess) => {
  // Send a signal to stop the child process
  childProcess.kill();
};

(async () => {
  const LINES_PER_FRAME = 14;
  const DELAY = 67;
  const mp3FilePath = join(__dirname, 'starwars.mp3');

  // Play the MP3 file and get the child process
  const mp3PlayerProcess = await playMp3(mp3FilePath);

  // Listen for the exit event of the Node.js process and stop the music
  process.on('exit', () => {
    stopMp3(mp3PlayerProcess);
  });

  // Read and display the film data
  const filmData = (await readFileAsync(join(__dirname, 'starwars.txt'), 'utf8')).split('\n');
  console.error('\n'.repeat(LINES_PER_FRAME));

  for (let i = 0; i < filmData.length; i += LINES_PER_FRAME) {
    console.error(`\x1b[${LINES_PER_FRAME}A\x1b[J${filmData.slice(i + 1, i + LINES_PER_FRAME).join('\n')}`);
    await delay(parseInt(filmData[i], 10) * DELAY);
  }
})().catch(e => console.error(e.stack || e));
