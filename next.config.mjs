/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/:club/top/:top',
          destination: '/',
        },
      ];
    },
  };

export default nextConfig;
