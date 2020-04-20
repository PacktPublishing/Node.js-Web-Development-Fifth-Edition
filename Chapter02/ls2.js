const fs = require('fs').promises;

async function listFiles() {
  try {
    var dir = '.';
    if (process.argv[2]) dir = process.argv[2];
    const files = await fs.readdir(dir);
    for (let fn of files) {
      console.log(fn);
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
  var dir = '.';
  if (process.argv[2]) dir = process.argv[2];
  const files = await fs.readdir(dir);
  for (let fn of files) {
    console.log(fn);
  }
})().catch(err => { console.error(err); });

*/
