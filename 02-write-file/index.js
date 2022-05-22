const fs = require('fs');
const path = require('path');
const process = require('process');

let phrase = () => {
  console.log('Напишите что-нибудь душевное: ');
};

let makeTxt = () => {
  fs.writeFile(path.join(__dirname, '.', 'text.txt'), '', (err) => {
    if (err) throw err;
  });
};

makeTxt();

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('Как, уже уходите? Жаль...');
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
