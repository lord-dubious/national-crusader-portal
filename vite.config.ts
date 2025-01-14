import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from 'vite-imagetools';
import { buildConfig } from "./src/config/vite/build.config";
import { legacyConfig } from "./src/config/vite/legacy.config";
import { pwaConfig } from "./src/config/vite/pwa.config";
import { serverConfig } from "./src/config/vite/server.config";

export default defineConfig(({ mode }) => ({
  server: serverConfig,
  preview: serverConfig,
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
    legacyConfig,
    pwaConfig
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: buildConfig,
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