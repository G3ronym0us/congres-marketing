/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    api: '/api',
  },
  webpack: (config) => {
    // pdfjs-dist (vista previa de fondos PDF en el editor de certificados)
    // hace require('canvas') opcional para Node; en el navegador no se usa.
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
