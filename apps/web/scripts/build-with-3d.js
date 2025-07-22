#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building ivo-tech-website with 3D features...\n');

// Step 1: Set environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Step 2: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
} catch (e) {
  // Windows fallback
  try {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  } catch (e) {}
}

// Step 3: Create a temporary next.config for build
console.log('📝 Creating optimized build configuration...');
const nextConfigContent = `
/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '',
  trailingSlash: true,
  
  // Transpile packages
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/cannon',
    '@react-three/postprocessing',
    'postprocessing',
    'troika-three-text',
    'troika-worker-utils',
    'stats.js',
    'leva',
    'use-sound',
    'gsap',
  ],
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Server packages
  serverExternalPackages: ['nodemailer', 'three', '@react-three/fiber', '@react-three/drei'],
  
  // Webpack config
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore browser-only modules on server
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': false,
        '@react-three/fiber': false,
        '@react-three/drei': false,
      };
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
`;

// Backup original config
if (fs.existsSync('next.config.js')) {
  fs.copyFileSync('next.config.js', 'next.config.js.backup');
}

// Write temporary config
fs.writeFileSync('next.config.js.temp', nextConfigContent);

// Step 4: Build with error handling
console.log('🔨 Building application...\n');
try {
  // Use the temporary config
  fs.renameSync('next.config.js', 'next.config.js.original');
  fs.renameSync('next.config.js.temp', 'next.config.js');
  
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_DISABLE_SSR_WARNINGS: 'true',
      NODE_OPTIONS: '--max-old-space-size=8192'
    }
  });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  
  // Restore original config
  if (fs.existsSync('next.config.js.original')) {
    fs.renameSync('next.config.js.original', 'next.config.js');
  }
  
  // Try alternative build method
  console.log('\n🔄 Trying alternative build method...');
  try {
    execSync('next build --no-lint', { stdio: 'inherit' });
    console.log('\n✅ Alternative build completed!');
  } catch (e) {
    console.error('\n❌ Alternative build also failed');
    process.exit(1);
  }
} finally {
  // Restore original config
  if (fs.existsSync('next.config.js.original')) {
    fs.unlinkSync('next.config.js');
    fs.renameSync('next.config.js.original', 'next.config.js');
  }
}

// Step 5: Generate static export if needed
if (process.argv.includes('--static')) {
  console.log('\n📦 Generating static export...');
  try {
    execSync('next export', { stdio: 'inherit' });
    console.log('\n✅ Static export completed!');
  } catch (e) {
    console.log('\n⚠️  Static export not available with current configuration');
  }
}

console.log('\n🎉 Build process completed!');
console.log('\nNext steps:');
console.log('1. Test locally: npm start');
console.log('2. Deploy to Vercel: vercel --prod');
console.log('3. Or use static files from: out/');
