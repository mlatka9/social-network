import { env } from './src/env/server.mjs';

import asd from '@next/bundle-analyzer';
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return withBundleAnalyzer(config);
}

const withBundleAnalyzer = asd({
  enabled: process.env.ANALYZE === 'true',
});

export default defineNextConfig({
  // experimental: {
  //   images: {
  //     unoptimized: true,
  //   }
  // },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'cloudflare-ipfs.com',
      'loremflickr.com',
      'avatars.githubusercontent.com'
    ],
  },
});
