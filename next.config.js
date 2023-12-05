/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                hostname: "imagecdn.me"
            }
        ]
    }
}

module.exports = nextConfig
