const fs = require('fs').promises;

async function listFiles() {
  try {
    const files = await fs.readdir('.');
    for (const file of files) {
      console.log(file);
    }
  } catch (err) {
    console.error(err);
  }
}

listFiles();

/*

// Some may prefer to use this style

const fs = require('fs').promises;

(async () => {
  const files = await fs.readdir('.');
  for (let fn of files) {
    console.log(fn);
  }
})().catch(err => { console.error(err); });

*/
