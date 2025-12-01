import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deserving-bouquet-d41dc59d47.media.strapiapp.com",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
