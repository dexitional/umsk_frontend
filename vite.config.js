import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  envPrefix: 'REACT_APP_',
  define: {
    // "process.env": process.env,
    // // By default, Vite doesn't include shims for NodeJS/
    // // necessary for segment analytics lib to work
   // "global": {}, // Comment Out during Build
  },
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only split out dependencies needed on nearly every route, so they
          // cache independently of app code. Everything else is left to Rollup's
          // automatic chunking, which keeps page-specific libraries (xlsx, jspdf,
          // html2canvas, quill, etc.) out of the eagerly-preloaded path.
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) return 'vendor-react';
            if (id.includes('@tanstack')) return 'vendor-query';
          }
        },
      },
    },
  },
}))
