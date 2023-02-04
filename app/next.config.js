/** @type {import('next').NextConfig} */

async function redirects() {
  return [
    {
      destination: '/account',
      permanent: true,
      source: '/',
    },
  ];
}

const nextConfig = {
  images: { domains: ['lh3.googleusercontent.com', 'storage.googleapis.com'] },
  reactStrictMode: true,
  redirects,
};

module.exports = nextConfig;
