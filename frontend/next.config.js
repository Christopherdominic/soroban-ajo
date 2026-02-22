/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_SOROBAN_RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL,
    NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE: process.env.NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE,
    NEXT_PUBLIC_SOROBAN_CONTRACT_ID: process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID,
  },
}

module.exports = nextConfig
