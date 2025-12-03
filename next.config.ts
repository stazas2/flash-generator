import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.100.20'],
  },
};

export default nextConfig;
