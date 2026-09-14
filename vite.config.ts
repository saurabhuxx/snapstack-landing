import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sitemap: resolve(__dirname, 'site-map.html'),
      },
    },
  },
})
