import { BuildOptions } from 'vite';

export const buildConfig: BuildOptions = {
  modulePreload: {
    polyfill: true
  },
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
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