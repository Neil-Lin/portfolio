if(!self.define){let e,r={};const i=(i,n)=>(i=new URL(i+".js",n).href,r[i]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=r,document.head.appendChild(e)}else e=i,importScripts(i),r()})).then((()=>{let e=r[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>i(e,u),a={module:{uri:u},exports:l,require:o};r[u]=Promise.all(n.map((e=>a[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.460c5b0c.js",revision:null},{url:"_nuxt/akContainer.df2d65b6.js",revision:null},{url:"_nuxt/choose-chart.3a4cf67e.js",revision:null},{url:"_nuxt/composables.040133ea.js",revision:null},{url:"_nuxt/default.0611662b.js",revision:null},{url:"_nuxt/default.0d519985.css",revision:null},{url:"_nuxt/en-US.5fa9b2e2.js",revision:null},{url:"_nuxt/entry.ce9a5013.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.972193d1.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-500.e4916ddb.js",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.91be74d7.js",revision:null},{url:"_nuxt/index.09c26a62.js",revision:null},{url:"_nuxt/mpos.ccd03b51.js",revision:null},{url:"_nuxt/nuxt-link.b2cb8517.js",revision:null},{url:"_nuxt/piman.f663a461.js",revision:null},{url:"_nuxt/scout.4c719525.js",revision:null},{url:"_nuxt/sitemap.e5cb5344.js",revision:null},{url:"_nuxt/theAside.96776efa.css",revision:null},{url:"_nuxt/theAside.vue.fb7e7f92.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.bbf02f01.js",revision:null},{url:"_nuxt/vitalcrm-app.80fc21dd.js",revision:null},{url:"_nuxt/vitalsespsurvey.0dac615b.js",revision:null},{url:"_nuxt/vitaluikit.3294f76a.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.524086a4.js",revision:null},{url:"_nuxt/zh-Hant-TW.f4dec575.js",revision:null},{url:"200",revision:"0f80d34fee20bf190ba5bcb52328033c"},{url:"404",revision:"0f80d34fee20bf190ba5bcb52328033c"},{url:"about",revision:"564056d5cefb69f554c688c6c6236601"},{url:"en/about",revision:"c800e806fcce32b3fdce68aa431aca2c"},{url:"en",revision:"c678accb6df3a4e6649e1e9bbb922da8"},{url:"en/sitemap",revision:"a67d76985b670ed947b7fa74c9f42f44"},{url:"en/works/choose-chart",revision:"3e2f58ead00117f08f55a10bd6bad8bb"},{url:"en/works",revision:"67f2d7396d7b5df32b246fb31dded44a"},{url:"en/works/mpos",revision:"fca102a540f163e7a95e3728e74ffe83"},{url:"en/works/piman",revision:"b6721d71536da45d086ed5cebac1e4e0"},{url:"en/works/scout",revision:"79638d35aca70e13857b315af43b2892"},{url:"en/works/vitalcrm-app",revision:"c6e461424b96f57def6f1a341754b8ff"},{url:"en/works/vitalsespsurvey",revision:"5ece31437b61d8a186b82f0476780a43"},{url:"en/works/vitaluikit",revision:"aa6e3cc9b54c6bfed13fdea071ad7712"},{url:"/portfolio/",revision:"9915b1d2c860679ca4900a86e8fe46b8"},{url:"js/clarity.js",revision:"8e03800d0928fc69aed7d28e87910181"},{url:"sitemap",revision:"59f729bf475a822aa755c0c3b4ded270"},{url:"works/choose-chart",revision:"6ad609a7ea4cffeb1ecd0ce061c513ea"},{url:"works",revision:"ab4a2cc16d94a2f0615b43d4b2524504"},{url:"works/mpos",revision:"fd03a42f15a51a639992b5e2f905d8ca"},{url:"works/piman",revision:"fb16e7a5fb60602cd70e06cdd3c21ae9"},{url:"works/scout",revision:"f0fb6197f760ded444d14a52d76cbf1d"},{url:"works/vitalcrm-app",revision:"5f89989298825f6483208b4bac239e9e"},{url:"works/vitalsespsurvey",revision:"c53a42334222b69552f38f78839f665e"},{url:"works/vitaluikit",revision:"e97a1a1ecb87ca5bc727091c4a2fd448"},{url:"manifest.webmanifest",revision:"10e389680c8fca350ec43f354700f043"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
