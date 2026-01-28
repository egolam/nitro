import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.maresans.com",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
