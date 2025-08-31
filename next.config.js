/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors
  },
};

module.exports = nextConfig;
