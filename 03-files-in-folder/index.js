const fs = require('fs');
const path = require('path');

fs.readdir(`${__dirname}/secret-folder`, (err, data) => {
  if (err) throw err;
  let str = '';

  data.forEach((file) => {
    const obj = path.parse(file);

    fs.stat(path.join(__dirname, 'secret-folder', file), (err, info) => {
      if (err) throw err;
      if (!info.isDirectory()) {
        str =
          obj.name +
          ' - ' +
          obj.ext.slice(1) +
          ' - ' +
          Math.round(info.size / 1024) +
          ' kb';
        console.log('\x1b[36m', str);
      }
    });
  });
});
