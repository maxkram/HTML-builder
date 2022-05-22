const fs = require('fs/promises');
const path = require('path');

async function copying(main, copy) {
  try {
    await fs.rm(copy, { recursive: true, force: true });
    await fs.mkdir(copy);
    const items = await fs.readdir(main, { withFileTypes: true });
    items.forEach((i) => {
      if (i.isFile()) {
        fs.copyFile(path.join(main, i.name), path.join(copy, i.name));
      }
      if (i.isDirectory()) {
        copying(path.join(main, i.name), path.join(copy, i.name));
      }
    });
  } catch (err) {
    console.log('Ошибочка: ', '\x1b[31m', err);
  }
}

copying(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
