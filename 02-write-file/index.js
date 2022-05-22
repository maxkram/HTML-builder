const fs = require('fs');
const path = require('path');
const process = require('process');

let phrase = () => {
  console.log('\x1b[36m%s\x1b[0m', 'Напишите что-нибудь душевное: ');
};

let makeTxt = () => {
  fs.writeFile(path.join(__dirname, '.', 'text.txt'), '', (err) => {
    if (err) throw err;
  });
};

makeTxt();

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('\x1b[33mКак, уже уходите? Жаль...  \x1b[0m');

    process.exit();
  } else {
    fs.appendFile(
      path.join(__dirname, '.', 'text.txt'),
      `${data.toString()}`,
      (err) => {
        if (err) throw err;
      }
    );
  }
});

phrase();
