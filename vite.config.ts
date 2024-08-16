import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';
import path from 'path';
import viteTouchGlobalCss from './vite-plugin-touch-global-css';

console.log(path.resolve(__dirname, 'src/content.css'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteTouchGlobalCss({
      cssFilePath: path.resolve(__dirname, 'src/content.css'),
      watchFiles: ['/src/ContentUI/'],
    }),
    react(),
    crx({ manifest }),
  ],
});
