/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/account',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
