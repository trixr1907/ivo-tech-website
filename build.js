const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build all apps
execSync('pnpm build', { stdio: 'inherit' });

// Create the output directory if it doesn't exist
const outputDir = path.join(__dirname, '.vercel', 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy the web app build output
const webBuildDir = path.join(__dirname, 'apps', 'web', '.next');
if (fs.existsSync(webBuildDir)) {
  fs.cpSync(webBuildDir, path.join(outputDir, 'web'), { recursive: true });
}

// Copy the API build output
const apiBuildDir = path.join(__dirname, 'apps', 'api', '.next');
if (fs.existsSync(apiBuildDir)) {
  fs.cpSync(apiBuildDir, path.join(outputDir, 'api'), { recursive: true });
}

// Copy the docs build output
const docsBuildDir = path.join(__dirname, 'apps', 'docs', '.next');
if (fs.existsSync(docsBuildDir)) {
  fs.cpSync(docsBuildDir, path.join(outputDir, 'docs'), { recursive: true });
}
