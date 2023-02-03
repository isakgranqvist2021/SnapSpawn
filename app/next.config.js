/** @type {import('next').NextConfig} */

async function redirects() {
  return [
    {
      source: '/',
      destination: '/account',
      permanent: true,
    },
  ];
}

const nextConfig = {
  reactStrictMode: true,
  redirects,
};

module.exports = nextConfig;
