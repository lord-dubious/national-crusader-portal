/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nuyliaknnbgbtrrmqyje.supabase.co'], // Add your Supabase project URL
  },
}

module.exports = nextConfig