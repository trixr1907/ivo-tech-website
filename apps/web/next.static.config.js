/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import './server-polyfills.js'; // Load polyfills early

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'export',
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
  
  // Enhanced image optimization
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    // The loose setting helps with ESM/CJS compatibility
    esmExternals: 'loose',
  },
  
  // Webpack optimizations
  webpack: (config, { dev }) => {
    // Tree-shaking optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      // Three.js tree-shaking
      'three/examples/jsm/loaders/GLTFLoader': 'three/examples/jsm/loaders/GLTFLoader.js',
      'three/examples/jsm/controls/OrbitControls': 'three/examples/jsm/controls/OrbitControls.js',
      // Lodash tree-shaking
      'lodash': 'lodash-es',
    };
    
    // Handle webpack 5 polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      buffer: false,
      stream: false,
    };
    
    // Production optimizations
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.concatenateModules = true;
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
