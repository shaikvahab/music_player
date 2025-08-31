import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  css: {
    transformer: "postcss" // disable lightningcss
  },
  build: {
    outDir: "dist", // default, Vercel expects dist
  },
  future: {
    disableTailwindOxide: true,
  },
})
