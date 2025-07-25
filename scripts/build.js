const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Build all apps
console.log('Building all apps...');
execSync('turbo run build', { stdio: 'inherit' });

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
fs.ensureDirSync(distDir);

// Copy build outputs
const apps = ['web', 'api', 'docs'];
apps.forEach(app => {
  const buildDir = path.join(__dirname, '..', 'apps', app, '.next');
  const targetDir = path.join(distDir, app);

  if (fs.existsSync(buildDir)) {
    console.log(`Copying ${app} build output...`);
    fs.copySync(buildDir, targetDir);
  }
});
