import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  },

  server: {
    port: 5173,
    open: true
  }
})
