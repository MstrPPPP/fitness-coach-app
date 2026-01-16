/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/lib"],
  reactStrictMode: true,
};

module.exports = nextConfig;
