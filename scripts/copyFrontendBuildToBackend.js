const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'frontend', 'dist');
const targetDir = path.join(rootDir, 'backend', 'dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source build folder does not exist: ${src}`);
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  copyDirRecursive(sourceDir, targetDir);
  // eslint-disable-next-line no-console
  console.log(`Copied frontend build: ${sourceDir} -> ${targetDir}`);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Failed to copy frontend build into backend/dist:', error);
  process.exit(1);
}

