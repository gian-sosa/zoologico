import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { localApiPlugin } from './server/vite-api.mjs'

export default defineConfig(({ mode, command }) => ({
  plugins: [react(), tailwindcss(), ...(command === 'serve' ? [localApiPlugin(loadEnv(mode, process.cwd(), ''))] : [])],
  build: {
    target: 'es2022',
    cssMinify: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules') && /react(-dom|-router-dom)?/.test(id)) return 'vendor'
        },
      },
    },
  },
}))
