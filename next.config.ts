import { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
