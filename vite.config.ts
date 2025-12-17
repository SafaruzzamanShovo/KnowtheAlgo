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
          // Tiptap dependencies grouped together
          'editor-libs': [
            '@tiptap/react', 
            '@tiptap/starter-kit', 
            '@tiptap/extension-image', 
            '@tiptap/extension-link',
            '@tiptap/extension-youtube',
            '@tiptap/extension-table',
            '@tiptap/extension-code-block-lowlight'
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
});
