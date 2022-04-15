const client_manifest = {
  "node_modules/nuxt3/dist/app/entry.mjs": {
    "file": "entry-4cd04b6a.mjs",
    "src": "node_modules/nuxt3/dist/app/entry.mjs",
    "isEntry": true,
    "dynamicImports": [
      "pages/index.vue",
      "pages/vitalcrm/index.vue",
      "layouts/default.vue"
    ],
    "css": [
      "entry.2d55a0e6.css"
    ]
  },
  "pages/index.vue": {
    "file": "index-662ea4cb.mjs",
    "src": "pages/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  },
  "pages/vitalcrm/index.vue": {
    "file": "index-3e02e6fc.mjs",
    "src": "pages/vitalcrm/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  },
  "layouts/default.vue": {
    "file": "default-f225b5e2.mjs",
    "src": "layouts/default.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  }
};

export { client_manifest as default };
