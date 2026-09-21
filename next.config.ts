import type { NextConfig } from 'next';

/**
 * Fully static export: the site has no server runtime and deploys to Vercel
 * (or any static host) as plain HTML/CSS/JS.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
