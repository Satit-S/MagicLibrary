import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/MagicLibrary/',
  plugins: [react()],
  build: { outDir: 'dist' }, 
  server: { 
    open: true, 
    port: 3000 } ,
    esbuild: { 
      legalComments: 'none', 
    },
  });