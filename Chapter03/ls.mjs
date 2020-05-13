import { promises as fs } from 'fs';

/*
(async () => {
  const files = await fs.readdir('.');
  for (let fn of files) {
    console.log(fn);
  }
})().catch(err => { console.error(err); });
*/

async function listFiles() {
    const files = await fs.readdir('.');
    for (const file of files) {
        console.log(file);
    }
}

listFiles().catch(err => { console.error(err); });

