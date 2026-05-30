import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/sobre', destination: '/about' },
      { source: '/contactos', destination: '/contact' },
      { source: '/privacidade', destination: '/privacy' },
      { source: '/termos', destination: '/terms' },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
