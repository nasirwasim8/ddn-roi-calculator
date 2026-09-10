import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo-ddn.svg'],
      manifest: {
        name: 'DDN Infinia ROI Calculator',
        short_name: 'DDN ROI',
        description: 'Calculate the ROI of DDN Infinia Persistent AI Memory for LLM inference workloads',
        theme_color: '#ED2738',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
