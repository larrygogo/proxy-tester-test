/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['ahooks', '@tauri-apps/api']
}
module.exports = nextConfig
