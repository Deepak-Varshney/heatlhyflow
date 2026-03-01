import type { NextConfig } from 'next';

// Base Next.js configuration
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increased from default 1MB to support medical file uploads
      allowedOrigins: ['localhost', 'localhost:3000']
    }
  }
};

export default nextConfig;
