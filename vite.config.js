import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  root: 'src',
  base: '/billion-seconds/',
  plugins: [
    legacy({ targets: ['defaults', 'not IE 11'] }),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
