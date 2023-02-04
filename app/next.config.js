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
  images: {
    domains: ['lh3.googleusercontent.com', 'storage.googleapis.com'],
  },
};

module.exports = nextConfig;
