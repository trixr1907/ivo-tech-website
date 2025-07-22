#!/usr/bin/env node

console.log('🚀 IVO-TECH Deployment Preflight Check\n');

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];

// Check 1: Node version
console.log('1️⃣ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
  errors.push(`Node.js version ${nodeVersion} is too old. Required: >=18`);
} else {
  console.log(`✅ Node.js ${nodeVersion} - OK`);
}

// Check 2: Package.json exists
console.log('\n2️⃣ Checking package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  errors.push('package.json not found');
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`✅ package.json found - ${packageJson.name}@${packageJson.version}`);
  
  // Check dependencies
  const requiredDeps = ['next', 'react', 'react-dom'];
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
      errors.push(`Missing required dependency: ${dep}`);
    }
  });
}

// Check 3: Next.js config
console.log('\n3️⃣ Checking next.config.js...');
const nextConfigPath = path.join(__dirname, 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  errors.push('next.config.js not found');
} else {
  console.log('✅ next.config.js found');
  
  // Check for problematic imports
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfigContent.includes("import './lib/polyfills")) {
    warnings.push('next.config.js imports polyfills which may cause build issues');
  }
}

// Check 4: Global polyfills
console.log('\n4️⃣ Checking global polyfills...');
const polyfillFiles = [
  'lib/polyfills.js',
  'lib/globalThis-polyfill.js'
];

polyfillFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found ${file}`);
  } else {
    warnings.push(`Missing polyfill file: ${file}`);
  }
});

// Check 5: Build directory
console.log('\n5️⃣ Checking build artifacts...');
const buildDirs = ['.next', 'out'];
buildDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`⚠️  Found ${dir} directory - consider cleaning before deploy`);
    warnings.push(`${dir} directory exists - run 'rm -rf ${dir}' to clean`);
  }
});

// Check 6: Environment variables
console.log('\n6️⃣ Checking environment variables...');
const requiredEnvVars = ['NODE_ENV'];
const optionalEnvVars = ['NEXT_PUBLIC_SITE_URL', 'VERCEL_URL'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    warnings.push(`Environment variable ${envVar} not set`);
  }
});

// Check 7: Three.js SSR issues
console.log('\n7️⃣ Checking for SSR compatibility issues...');
const componentsDir = path.join(__dirname, 'components', '3d');
if (fs.existsSync(componentsDir)) {
  const files = fs.readdirSync(componentsDir);
  const problematicImports = [];
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      if (content.includes('import') && content.includes('three') && !content.includes('dynamic')) {
        problematicImports.push(file);
      }
    }
  });
  
  if (problematicImports.length > 0) {
    warnings.push(`Found ${problematicImports.length} 3D components without dynamic imports`);
  }
}

// Check 8: Dependencies versions
console.log('\n8️⃣ Checking dependency versions...');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = packageJson.dependencies || {};
  
  // Check Next.js version
  if (deps.next) {
    const nextVersion = deps.next.replace(/[\^~]/, '');
    console.log(`   Next.js: ${nextVersion}`);
    if (nextVersion.startsWith('15')) {
      warnings.push('Using Next.js 15 (experimental) - may have stability issues');
    }
  }
  
  // Check React version
  if (deps.react) {
    console.log(`   React: ${deps.react}`);
  }
} catch (e) {
  errors.push('Failed to check dependency versions');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 PREFLIGHT CHECK SUMMARY\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Ready for deployment.');
} else {
  if (errors.length > 0) {
    console.log(`❌ ERRORS (${errors.length}):`);
    errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach((warn, i) => console.log(`   ${i + 1}. ${warn}`));
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('   1. Fix all errors before deployment');
  console.log('   2. Consider addressing warnings for better stability');
  console.log('   3. Run "npm run build" locally to test the build');
  console.log('   4. Use "vercel build" to simulate Vercel environment');
}

console.log('\n' + '='.repeat(50));

// Exit with error code if there are errors
process.exit(errors.length > 0 ? 1 : 0);
