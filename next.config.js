/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow server-side rendering for dynamic routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;