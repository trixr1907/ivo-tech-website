/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true }, // Temporär für das erste Deployment
  eslint: { ignoreDuringBuilds: true }, // Temporär für das erste Deployment
  reactStrictMode: true,
  transpilePackages: ['three'],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'framer-motion',
    ],
  },
  images: {
    domains: ['cdn.sanity.io', 'res.cloudinary.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Vercel-spezifische Optimierungen
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout: 120,

  // Content Security Policy
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Cache-Control Headers für statische Assets
  async rewrites() {
    return [
      {
        source: '/agb',
        destination: '/agb',
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Optimierungen für Three.js
    if (!isServer) {
      config.resolve.alias.three = require('path').resolve(
        './node_modules/three'
      );
    }

    // Draco Dekompression für 3D-Modelle
    config.module.rules.push({
      test: /\.gltf$/,
      use: ['draco-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
