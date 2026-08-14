import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  outDir: 'dist',
  target: 'node20',
  platform: 'node',
  treeshake: true,
  external: ['jiti'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
