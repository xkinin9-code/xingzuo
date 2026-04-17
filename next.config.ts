import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: process.env.STATIC_EXPORT === "true",
  },
  output: process.env.STATIC_EXPORT === "true" ? "export" : undefined,
  distDir: process.env.STATIC_EXPORT === "true" ? "dist" : ".next",
};

export default nextConfig;
