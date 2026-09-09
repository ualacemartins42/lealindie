import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), netlify()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
