/** @type {import('next').NextConfig} */
const prefix = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: prefix,
  assetPrefix: prefix + '/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
