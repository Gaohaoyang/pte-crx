// vite-plugin-touch-global-css.ts

import fs from 'fs';
import { Plugin } from 'vite';

function touchFile(filePath: string): void {
  console.log('touching file', filePath);
  const time = new Date();
  fs.utimesSync(filePath, time, time);
}

type TouchGlobalCSSPluginOptions = {
  cssFilePath: string;
  watchFiles: string[];
};

export default function touchGlobalCSSPlugin({
  cssFilePath,
  watchFiles,
}: TouchGlobalCSSPluginOptions): Plugin {
  return {
    name: 'touch-global-css',
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (
          watchFiles.some((watchFile) => {
            return file.includes(watchFile);
          })
        ) {
          touchFile(cssFilePath);
        }
      });
    },
  };
}
