import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "imagecdn.me",
      },
    ],
  },
};

export default nextConfig;
