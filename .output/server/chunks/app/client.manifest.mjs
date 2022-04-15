const client_manifest = {
  "node_modules/nuxt3/dist/app/entry.mjs": {
    "file": "entry-26e86989.mjs",
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
    "file": "index-647b2f61.mjs",
    "src": "pages/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  },
  "pages/vitalcrm/index.vue": {
    "file": "index-9a598ba9.mjs",
    "src": "pages/vitalcrm/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  },
  "layouts/default.vue": {
    "file": "default-4f7a0ca2.mjs",
    "src": "layouts/default.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt3/dist/app/entry.mjs"
    ]
  }
};

export { client_manifest as default };