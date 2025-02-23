import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      devOptions: {
        enabled: true, // Enables PWA features during development
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', '**/*.png'], // Cache all PNGs in subdirectories
      manifest: {
        name: 'Password Manager',
        short_name: 'PassVault',
        description: 'A secure and simple password manager built with MERN stack',
        theme_color: '#1e40af', // Blue theme color
        background_color: '#ffffff', // White splash screen
        display: 'standalone', // Native app-like experience
        scope: '/',
        start_url: '/',
        icons: [
          // Core PWA icons (commonly used sizes)
          {
            src: '/android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          // Maskable icon (using a square icon with padding, assuming you’ve prepared one)
          {
            src: '/android/android-launchericon-512-512.png', // Replace with a maskable version if available
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          // Additional icons for Windows
          {
            src: '/windows11/Square150x150Logo.scale-200.png',
            sizes: '300x300',
            type: 'image/png',
          },
          {
            src: '/windows11/LargeTile.scale-100.png',
            sizes: '310x310',
            type: 'image/png',
          },
          // Additional icons for iOS
          {
            src: '/ios/180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/ios/120.png',
            sizes: '120x120',
            type: 'image/png',
          },
          // Smaller icon for general use
          {
            src: '/android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Cache all static assets, including PNGs in subdirectories
        globPatterns: ['**/*.{js,css,html,png}'],
      },
    }),
  ],
  base: '/',
});