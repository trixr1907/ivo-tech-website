/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const prefix = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  // Removed 'output: export' to enable middleware
  basePath: prefix,
  trailingSlash: true,
  
  // Enhanced image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    esmExternals: true,
  },
  
  // Server external packages
  serverExternalPackages: ['three', '@react-three/fiber', 'nodemailer'],
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Aggressive Bundle Splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 50000,
        cacheGroups: {
          // Critical framework chunk
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 40,
            enforce: true,
          },
          // Three.js separate chunk
          three: {
            test: /[\\/]node_modules[\\/](three)[\\/]/,
            name: 'three-core',
            chunks: 'all',
            priority: 35,
          },
          // React Three Fiber separate chunk
          r3f: {
            test: /[\\/]node_modules[\\/](@react-three)[\\/]/,
            name: 'react-three',
            chunks: 'all',
            priority: 30,
          },
          // Other UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 25,
          },
          // Vendor chunk für andere libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Common chunk für eigenen Code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    };
    
    // Tree-shaking Optimierungen
    config.resolve.alias = {
      ...config.resolve.alias,
      // Three.js tree-shaking
      'three/examples/jsm/loaders/GLTFLoader': 'three/examples/jsm/loaders/GLTFLoader.js',
      'three/examples/jsm/controls/OrbitControls': 'three/examples/jsm/controls/OrbitControls.js',
      // Lodash tree-shaking
      'lodash': 'lodash-es',
    };
    
    // Minimize JS in production
    if (!dev) {
      config.optimization.minimize = true;
    }
    
    // Exclude development dependencies from bundle
    if (!dev && !isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        // Development-only packages ausschließen
      ];
    }
    
    // Prevent browser-only code from running on server
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        // Browser-only APIs
        'canvas',
        'gl',
      ];
    }
    
    // Simple fix for browser globals on server
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        canvas: false,
      };
    }
    
    // Simple fix for self variable
    config.plugins.push(new webpack.DefinePlugin({
      'typeof self': JSON.stringify('undefined'),
    }));
    
    return config;
  },
  
  // Compression and caching
  compress: true,
  generateEtags: true,
  
  // Production source maps disabled for smaller bundles
  productionBrowserSourceMaps: false,
  
  // Disable ESLint during build to avoid config issues
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withBundleAnalyzer(nextConfig);
