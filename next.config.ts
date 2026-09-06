import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero is a large full-bleed photograph; 75 leaves visible banding in
    // the sky gradient, so 85 is allowed alongside the default.
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
