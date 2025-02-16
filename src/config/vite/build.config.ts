
import type { BuildOptions } from 'vite';

export const buildConfig: BuildOptions = {
  modulePreload: {
    polyfill: true
  },
  minify: 'esbuild',
  sourcemap: true,
  target: ['es2015', 'safari10'],
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
        'query-vendor': ['@tanstack/react-query']
      }
    }
  }
};
