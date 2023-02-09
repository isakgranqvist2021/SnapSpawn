/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      's.gravatar.com',
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
