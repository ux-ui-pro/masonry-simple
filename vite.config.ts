import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }: { command: 'build' | 'serve' }) => {
  const config: UserConfig = {
    plugins:
      command === 'build'
        ? [
            dts({
              outDir: 'dist',
              insertTypesEntry: true,
              entryRoot: 'src',
              rollupTypes: true,
            }),
          ]
        : [],
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'MasonrySimple',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          if (format === 'umd') return 'index.umd.js';
          if (format === 'cjs') return 'index.cjs.js';
          return 'index.es.js';
        },
      },
      emptyOutDir: true,
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          assetFileNames: 'index.[ext]',
        },
      },
    },
  };

  return config;
});
