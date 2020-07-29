const fs = require('fs');

const fs_readdir = dir => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, fileList) => {
            if (err) reject(err);
            else resolve(fileList);
        });
    });
};

async function listFiles() {
    try {
        let dir = '.';
        if (process.argv[2]) dir = process.argv[2];
        const files = await fs_readdir(dir);
        for (let fn of files) {
            console.log(fn);
        }
    } catch(err) { console.error(err); }
}

listFiles();
