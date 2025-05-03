/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:1337/api/:path*', // Proxy requests to Strapi
        },
      ];
    },
  };
