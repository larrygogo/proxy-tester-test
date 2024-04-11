import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteWebfontDownload from "vite-plugin-webfont-dl"

export default defineConfig({
  plugins: [
    react(),
    viteWebfontDownload([
      "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
    ]),
  ],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  // to access the Tauri environment variables set by the CLI with information about the current target
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // 为调试构建生成源代码映射 (sourcemap)
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      // 为了在项目中使用绝对导入，我们需要为 src 目录创建一个别名
      "@": require("node:path").resolve(__dirname, "src"),
    },
  },
})
