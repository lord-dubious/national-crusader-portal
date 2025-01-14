import legacy from "@vitejs/plugin-legacy";

export const legacyConfig = legacy({
  targets: [
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
    'core-js/features/symbol'
  ],
  modernPolyfills: true,
  renderLegacyChunks: true,
  polyfills: [
    'es.array.iterator',
    'es.promise',
    'es.object.assign',
    'es.promise.finally',
    'es.symbol'
  ]
});