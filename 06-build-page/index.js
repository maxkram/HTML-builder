const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const assetsTo = path.join(projectDist, 'assets');
const templateTo = path.join(__dirname, 'template.html');
let templateHtml = '';

async function htmlTo() {
  await fs.promises.mkdir(projectDist, { recursive: true });
  await fs.promises.mkdir(assetsTo, { recursive: true });
  cssTo();
  assetsMove(assets, assetsTo);

  const readStream = fs.createReadStream(templateTo, 'utf-8');
  readStream.on('data', (chunk) => (templateHtml += chunk));
  readStream.on('end', async () => {
    const templateNames = templateHtml.match(/{{.+}}/gi);
    for (const templateName of templateNames) {
      const name = templateName.replace(/{|}/g, '');
      const componentFile = path.join(components, `${name}.html`);
      try {
        const data = await componentsFrom(componentFile);
        templateHtml = changeCompenents(templateName, data);
      } catch {
        console.log(`Error: no such '${name}.html' file`);
      }
    }
    await projectTo(templateHtml);
  });
  readStream.on('error', () =>
    console.log('Error: template.html does not exist')
  );
}

async function componentsFrom(component) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(component, 'utf-8');
    let arr = [];
    readStream.on('data', (chunk) => arr.push(chunk));
    readStream.on('end', () => resolve(arr.join('')));
    readStream.on('error', () => reject(new Error('Error: no such component')));
  });
}

const changeCompenents = (title, data) => {
  return templateHtml.replaceAll(title, data);
};

async function projectTo(html) {
  const projectHtmlPath = path.join(projectDist, 'index.html');
  const stream = fs.createWriteStream(projectHtmlPath);
  stream.write(html);
}

async function cssTo() {
  try {
    await fs.promises.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      ''
    );
    const styles = await fs.promises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });

    for (const style of styles) {
      const filePath = path.join(path.join(__dirname, 'styles'), style.name);
      const filePathObject = path.parse(filePath);
      if (style.isFile() && filePathObject.ext === '.css') {
        let str = '';
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', (chunk) => (str += chunk));
        readableStream.on('end', () =>
          fs.promises.appendFile(
            path.join(__dirname, 'project-dist', 'style.css'),
            str
          )
        );
      }
    }

    // console.log('\x1b[36m', 'Файлик bundle.css, вроде, готов?');
  } catch (err) {
    console.error(err);
  }
}

async function assetsMove(assets, assetsTo) {
  const assetsData = await fs.promises.readdir(assets, {
    withFileTypes: true,
  });

  await removeFromTo(assetsTo);

  for (const data of assetsData) {
    if (data.isDirectory()) {
      const directoryPath = path.join(assets, data.name);
      const targetDirectory = path.join(assetsTo, data.name);
      await fs.promises.mkdir(targetDirectory, { recursive: true });
      assetsMove(directoryPath, targetDirectory);
    }
    if (data.isFile()) {
      const filePathOut = path.join(assets, data.name);
      const filePathIn = path.join(assetsTo, data.name);
      await fs.promises.copyFile(filePathOut, filePathIn);
    }
  }
}

async function removeFromTo(assetsTo) {
  const assetsTargetData = await fs.promises.readdir(assetsTo, {
    withFileTypes: true,
  });

  for (const data of assetsTargetData) {
    const targetDirectory = path.join(assetsTo, data.name);
    await fs.promises.rm(targetDirectory, { recursive: true, force: true });
  }
}

htmlTo();
