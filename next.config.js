const isProd = process.env.NODE_ENV === "production"

module.exports = async () => {
  return {
    output: "export",
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    assetPrefix: isProd ? null : "http://localhost:3000",
  }
}
