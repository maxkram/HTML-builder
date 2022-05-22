const fs = require('fs');
const path = require('path');

async function makeBundle() {
  try {
    await fs.promises.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      ''
    );
    const styles = await fs.promises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });

    for (const style of styles) {
      const filePath = path.join(path.join(__dirname, 'styles'), style.name);
      const filePathObject = path.parse(filePath);
      if (style.isFile() && filePathObject.ext === '.css') {
        let data = '';
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', (chunk) => (data += chunk));
        readableStream.on('end', () =>
          fs.promises.appendFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            data
          )
        );
      }
    }

    console.log('\x1b[36m', 'Файлик bundle.css, вроде, готов?');
  } catch (err) {
    console.error(err);
  }
}

makeBundle();
