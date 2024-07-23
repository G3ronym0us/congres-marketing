/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    api: '/api',
  },
};

module.exports = nextConfig;
