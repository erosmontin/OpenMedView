import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OpenMedView',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // don’t bundle peer deps
      external: ['react', 'react-dom', '@niivue/niivue'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@niivue/niivue': 'Niivue'
        }
      }
    }
  }
})
