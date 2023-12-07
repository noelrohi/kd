import "./src/env.mjs";
import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
});

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

const PWAConfig =
  process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);

export default PWAConfig;
