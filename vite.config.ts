import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from 'vite-imagetools';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    host: true,
    cors: true
  },
  preview: {
    port: 8080,
    host: true,
    cors: true
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: 'webp',
        quality: '80',
        w: '0;640;828;1200;1920',
        as: 'picture',
        metadata: 'keep'
      })
    }),
    legacy({
      targets: [
        'safari >= 12',
        'ios >= 12',
        'chrome >= 49',
        'firefox >= 52',
        'edge >= 18',
        'opera >= 36',
        'android >= 4.4'
      ],
      modernPolyfills: true,
      renderLegacyChunks: true,
      polyfills: [
        'es.array.iterator',
        'es.promise',
        'es.object.assign',
        'es.promise.finally',
        'es.symbol',
        'es.array.find',
        'es.array.includes',
        'es.string.includes',
        'es.string.pad-start',
        'es.string.pad-end',
        'es.object.entries',
        'es.object.values',
        'es.array.from',
        'es.array.of',
        'es.map',
        'es.set',
        'es.weak-map',
        'es.weak-set',
        'web.url',
        'web.url-search-params',
        'esnext.array.at',
        'esnext.array.find-last',
        'esnext.array.find-last-index',
        'esnext.object.has-own',
        'esnext.array.group'
      ],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/features/array/find',
        'core-js/features/array/includes',
        'core-js/features/string/includes'
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ['es2015', 'safari12'],
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    }
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
}));