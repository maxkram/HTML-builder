const fs = require('fs');
const path = require('path');

async function makeBundle() {
  try {
    console.log('\x1b[36m', 'bundle.css, вроде, создался?');
  } catch (err) {
    console.error(err);
  }
}

makeBundle();
