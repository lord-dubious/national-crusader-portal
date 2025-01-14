import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from 'vite-imagetools';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "::",
    port: 8080,
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
        'ie >= 11',
        'safari >= 10',
        'ios >= 10',
        'chrome >= 49',
        'firefox >= 52',
        'edge >= 79',
        'opera >= 36',
        'android >= 4.4'
      ],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/features/array/find',
        'core-js/features/array/includes',
        'core-js/features/string/includes',
        'core-js/features/promise',
        'core-js/features/object/assign',
        'core-js/features/symbol',
        'core-js/features/set',
        'core-js/features/map',
        'core-js/features/weak-map',
        'core-js/features/weak-set',
        'core-js/features/array/from',
        'core-js/features/array/find-index',
        'core-js/features/array/iterator',
        'core-js/features/string/starts-with',
        'core-js/features/string/ends-with',
        'core-js/features/string/repeat'
      ],
      modernPolyfills: true,
      renderLegacyChunks: true,
      polyfills: [
        'es.array.iterator',
        'es.promise',
        'es.object.assign',
        'es.promise.finally',
        'es.symbol',
        'es.symbol.async-iterator',
        'es.array.find',
        'es.array.includes',
        'es.string.includes',
        'es.object.entries',
        'es.object.from-entries',
        'es.array.from',
        'es.string.starts-with',
        'es.string.ends-with',
        'es.string.repeat',
        'es.array.find-index',
        'es.map',
        'es.set',
        'es.weak-map',
        'es.weak-set'
      ]
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'og-image.png', 'placeholder.svg'],
      manifest: {
        name: 'National Crusader',
        short_name: 'NC News',
        description: 'Breaking News and In-Depth Coverage',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          },
          {
            src: '/og-image.png',
            sizes: '1200x630',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/[^\/]+\.supabase\.co/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: {
      polyfill: true
    },
    minify: mode === 'production',
    sourcemap: mode === 'development',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    target: ['es2015', 'safari10', 'chrome49', 'firefox52', 'edge79', 'ie11'],
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          'query-vendor': ['@tanstack/react-query'],
          'pdf-vendor': ['react-pdf', 'pdfjs-dist'],
          'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-link', '@tiptap/extension-image'],
          'utils-vendor': ['date-fns', 'clsx', 'class-variance-authority', 'tailwind-merge']
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const extArray = assetInfo.name.split('.');
          const ext = extArray.length > 1 ? extArray.pop() : '';
          let extType = ext || '';
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        entryFileNames: 'entries/[name]-[hash].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      treeShaking: true,
      minify: true,
      supported: {
        'top-level-await': true,
        'dynamic-import': true,
        'import-meta': true,
      },
      target: ['es2015', 'safari10', 'chrome49', 'firefox52', 'edge79', 'ie11']
    },
    exclude: ['@tiptap/extension-image'],
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
}));