/** @type {import('next').NextConfig} */

const nextConfig = {
  poweredByHeader: false,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      's.gravatar.com',
      'oaidalleapiprodscus.blob.core.windows.net',
      'cdn.discordapp.com',
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
