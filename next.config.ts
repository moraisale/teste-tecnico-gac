/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { enabled: true }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;