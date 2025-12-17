import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-libs': ['framer-motion', 'lucide-react'],
          // Simplified editor chunking to avoid potential circular dependency issues during rollup
          'editor': ['@tiptap/react', '@tiptap/starter-kit']
        },
      },
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
});
