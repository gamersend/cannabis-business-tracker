/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  output: 'standalone',
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:Qzmpwxno1@192.168.0.150:5432/cannabis_tracker',
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
  }
}

module.exports = nextConfig
