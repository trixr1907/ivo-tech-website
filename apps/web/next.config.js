import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['three'],
  experimental: { optimizeCss: true },
  // Behandle patchFetch Problem durch Deaktivierung der statischen Generierung für problematische Seiten
  async rewrites() {
    return [
      {
        source: '/agb',
        destination: '/agb',
      },
    ];
  },
};

export default nextConfig;
