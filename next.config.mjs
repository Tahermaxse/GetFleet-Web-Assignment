/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://gps-staging.getfleet.ai/api/:path*",
      },
    ];
  },
};

export default nextConfig;
