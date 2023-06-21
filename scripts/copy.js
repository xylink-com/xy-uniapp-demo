const fs = require('fs-extra');
const path = require('path');

async function copyPkg(sourceFolder, destinationDirectory) {
  const npmPath = path.join(__dirname, sourceFolder);
  const distPath = path.join(__dirname, destinationDirectory);

  try {
    // Delete distPath if it exists
    await fs.remove(distPath);

    // Copy npmPath to distPath
    await fs.copy(npmPath, distPath);

    console.log('Package copied successfully.');
  } catch (error) {
    console.error('An error occurred while copying the package:', error);
  }
}

copyPkg('../node_modules/@xylink/xy-mp-sdk', '../src/wxcomponents/@xylink/xy-mp-sdk');
