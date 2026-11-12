import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide Next's floating dev-tools badge in `next dev`.
  devIndicators: false,
  images: {
    // The hero is a large full-bleed photograph; 75 leaves visible banding in
    // the sky gradient, so 85 is allowed alongside the default.
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Spotify album art (rendered unoptimized, so this is belt-and-braces)
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "*.spotifycdn.com" },
    ],
  },
};

export default nextConfig;
