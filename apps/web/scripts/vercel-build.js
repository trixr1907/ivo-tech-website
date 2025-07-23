const { execSync } = require('child_process');
const path = require('path');

// Ensure we're in the right directory
process.chdir(path.join(__dirname, '..'));

// Install dependencies
console.log('Installing dependencies...');
execSync('pnpm install', { stdio: 'inherit' });

// Run the build
console.log('Building the application...');
execSync('pnpm run build', { stdio: 'inherit' });
