import { promises as fs } from 'fs';

(async () => {
  const files = await fs.readdir('.');
  for (let fn of files) {
    console.log(fn);
  }
})().catch(err => { console.error(err); });