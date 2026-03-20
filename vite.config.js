import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Subscription Leak Finder',
        short_name: 'SubLeak',
        description: 'Find your $600 in 5 minutes. Track and cancel forgotten AU subscriptions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f2744',
        theme_color: '#0f2744',
        orientation: 'portrait-primary',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
  resolve: { alias: { '@': '/src' } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts:   ['recharts'],
        },
      },
    },
  },
});
