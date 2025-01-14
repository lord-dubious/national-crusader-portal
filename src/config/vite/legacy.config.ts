import legacy from "@vitejs/plugin-legacy";

export const legacyConfig = legacy({
  targets: ['defaults', 'not IE 11'],
  additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
  renderLegacyChunks: true,
  modernPolyfills: true
});