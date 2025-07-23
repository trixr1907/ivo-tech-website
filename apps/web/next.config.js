import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'utils'],
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ivo-tech.com',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // GLSL Shader Support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    // Optimierungen nur für Produktions-Builds
    if (!dev) {
      // Aktiviere Terser Komprimierung
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }

    return config;
  },
};

export default bundleAnalyzer(nextConfig);
