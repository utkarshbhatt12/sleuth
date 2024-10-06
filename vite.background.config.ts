import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/background.ts'),
      name: 'background',
      formats: ['es'],
      fileName: 'background',
    },
  },
});
