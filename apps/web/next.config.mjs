import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktiviere SWC Minification
  swcMinify: true,
  
  // TypeScript und React Optimierungen
  compiler: {
    styledComponents: true,
    reactRemoveProperties: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // !! WARN !!\n    // Nur für den Build aktivieren! Danach wieder auskommentieren
    ignoreBuildErrors: true,
  },
  // Optimierungen für Vercel
  output: 'standalone',
  typescript: { ignoreBuildErrors: false }, // Strict mode aktivieren
  eslint: { ignoreDuringBuilds: true }, // Temporär für das erste Deployment
  transpilePackages: ['three'],
  images: {
    domains: ['cdn.sanity.io', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { 
    optimizeCss: true,
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Vercel-spezifische Optimierungen
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Automatische Statische Optimierung
  staticPageGenerationTimeout: 120,

  // Content Security Policy
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ]
      }
    ]
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

  // Optimiere Images
  images: {
    domains: [], // Füge erlaubte Domains hinzu
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
