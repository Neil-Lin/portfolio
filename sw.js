if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>n(e,u),a={module:{uri:u},exports:l,require:o};r[u]=Promise.all(i.map((e=>a[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.84951810.js",revision:null},{url:"_nuxt/akContainer.b40cac13.js",revision:null},{url:"_nuxt/choose-chart.1f0c61f0.js",revision:null},{url:"_nuxt/composables.e06e2864.js",revision:null},{url:"_nuxt/default.22795f1c.css",revision:null},{url:"_nuxt/default.37a5f6a0.js",revision:null},{url:"_nuxt/en-US.5fa9b2e2.js",revision:null},{url:"_nuxt/entry.b256a0da.js",revision:null},{url:"_nuxt/error-404.02579324.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-500.369dc679.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.6e16f060.js",revision:null},{url:"_nuxt/index.09c6046e.js",revision:null},{url:"_nuxt/mpos.c9b3f41e.js",revision:null},{url:"_nuxt/nuxt-link.847cb3b7.js",revision:null},{url:"_nuxt/piman.94cb4985.js",revision:null},{url:"_nuxt/scout.8a44ee45.js",revision:null},{url:"_nuxt/sitemap.0b916134.js",revision:null},{url:"_nuxt/theAside.7442d1a5.css",revision:null},{url:"_nuxt/theAside.vue.619b62e2.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.1ddfc95c.js",revision:null},{url:"_nuxt/useMobileMenuBtn.b4a02da3.js",revision:null},{url:"_nuxt/vitalcrm-app.62c23de0.js",revision:null},{url:"_nuxt/vitalsespsurvey.103a2fa8.js",revision:null},{url:"_nuxt/vitaluikit.099cf192.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.6e622f42.js",revision:null},{url:"_nuxt/zh-Hant-TW.f4dec575.js",revision:null},{url:"200",revision:"a69fff62f3b1a408457ef7e23d5231d6"},{url:"404",revision:"a69fff62f3b1a408457ef7e23d5231d6"},{url:"about",revision:"1c1e426a545536088b66539945f4b935"},{url:"en/about",revision:"b091a8e9ac6dcc77dd63e51638f96b08"},{url:"en",revision:"6df4d574f2893b87d8d46a8245ecb931"},{url:"en/sitemap",revision:"606c140bda37634a3d5228ddb3f22cc2"},{url:"en/works/choose-chart",revision:"b9107bc64f0925d40a496c16882475c2"},{url:"en/works",revision:"f8a4b3ea74bdc3f964fcaa6ded620e67"},{url:"en/works/mpos",revision:"f2170488bdbfc53ed0b9d68eb5b90f9a"},{url:"en/works/piman",revision:"d9f7960a3985293e1b0742a6850ffd4c"},{url:"en/works/scout",revision:"5afb942232a60eb44c63d8df66f0d52c"},{url:"en/works/vitalcrm-app",revision:"ef562efb7b744094cede492d55c7c1fd"},{url:"en/works/vitalsespsurvey",revision:"ff22c10c57955e1124cce959c5dd19a3"},{url:"en/works/vitaluikit",revision:"dab532ea6e95485b7c871824867ac759"},{url:"/portfolio/",revision:"a0756a38358decce75193133646bba03"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"1ae2e95dc7cba547ac4c333d5d3ce745"},{url:"works/choose-chart",revision:"4b0eb9f3cf09d4a351363d046a7b4c91"},{url:"works",revision:"654a88ecc418f2bd7e2cff86f8004b79"},{url:"works/mpos",revision:"32c66bee0956c97c664587648d3994d8"},{url:"works/piman",revision:"41f89243f85aa61c51934a38fab665ea"},{url:"works/scout",revision:"be18278dfdee40acd897da18eb93c433"},{url:"works/vitalcrm-app",revision:"3e18d5a16b78be4876e78d7681355da8"},{url:"works/vitalsespsurvey",revision:"05c7a3525117c3b315a594aa2698b922"},{url:"works/vitaluikit",revision:"20ec38438f293fa62d9235582b754227"},{url:"manifest.webmanifest",revision:"10e389680c8fca350ec43f354700f043"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
