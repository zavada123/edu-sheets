import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The package build: two ES entries and one CSS file in lib/. The demo build (vite.config.ts) goes to dist/.
// Univer and React stay outside: the page that uses the package installs them once and bundles them itself.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "lib",
    emptyOutDir: true,
    // The page that uses the package minifies it with its own build.
    minify: false,
    lib: {
      entry: { core: "src/core.ts", react: "src/react.ts" },
      formats: ["es"],
      cssFileName: "style"
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@univerjs\//]
    }
  }
})
