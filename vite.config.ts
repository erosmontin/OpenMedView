// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OpenMedView',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@niivue/niivue', 'three'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@niivue/niivue': 'Niivue'
        }
      }
    }
  }
});
