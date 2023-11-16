const { join } = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);
const delay = promisify(setTimeout);

(async() => {
  const LINES_PER_FRAME = 14;
  const DELAY = 67;
  const filmData = (await readFileAsync(join(__dirname, 'starwars.txt'), 'utf8')).split('\n');
  console.error('\n'.repeat(LINES_PER_FRAME));
  for(let i = 0; i < filmData.length; i += LINES_PER_FRAME) {
    console.error(`\x1b[${LINES_PER_FRAME}A\x1b[J${filmData.slice(i + 1, i + LINES_PER_FRAME).join('\n')}`);
    await delay(parseInt(filmData[i], 10) * DELAY);
  }
})().catch(e => console.error(e.stack || e));