import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import criticalCss from 'vite-plugin-critical-css';

// The critical-CSS plugin launches headless Chrome (puppeteer) at build time.
// CI images like Vercel lack Chrome's shared libs (libnss3.so), so it fails there
// with no benefit. Run it only for local production builds.
const enableCriticalCss = !process.env.VERCEL && !process.env.CI

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    /* React Compiler disabled: can break conditional route trees in some setups */
    react(),
    enableCriticalCss &&
      criticalCss({
        // These options ensure it grabs CSS for both mobile and desktop views
        // dimensions: [
        //   { width: 375, height: 812 },  // Mobile
        //   { width: 1300, height: 900 }  // Desktop
        // ],
        inline: true,           // Inlines the critical CSS into the <head>
        deferStylesheets: true, // Converts your main render-blocking CSS to a preload/async request
      }),
  ],
  build: {
    // Split heavy dependencies so first paint JS is lighter on production hosting/CDNs.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['gsap'],
          // Done by Daksh Sharma: Removed three-vendor from manualChunks.
          // Why: Three.js and react-three packages are not imported or used anywhere in the src files.
          // Removing them from manualChunks prevents Rollup from bundling these unused libraries.
        },
      },
    },
  },
})
