if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>n(e,u),c={module:{uri:u},exports:l,require:o};r[u]=Promise.all(i.map((e=>c[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"__i18n__/prerender/aa090fbd.js",revision:"e707a914669db2b7370df131ad9f6e18"},{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.30d4f5d5.js",revision:null},{url:"_nuxt/akContainer.78acee38.js",revision:null},{url:"_nuxt/choose-chart.dc1ae3c3.js",revision:null},{url:"_nuxt/composables.665ec345.js",revision:null},{url:"_nuxt/default.22795f1c.css",revision:null},{url:"_nuxt/default.7dfa90e9.js",revision:null},{url:"_nuxt/en-US.dc0a7c19.js",revision:null},{url:"_nuxt/entry.9d30a088.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.94617f57.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-500.ea9d0cc0.js",revision:null},{url:"_nuxt/error-component.f6923b53.js",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.385e9320.js",revision:null},{url:"_nuxt/index.0bfcc9ec.js",revision:null},{url:"_nuxt/mpos.31eec9a3.js",revision:null},{url:"_nuxt/nuxt-link.7d6df5ba.js",revision:null},{url:"_nuxt/piman.1d7a7f68.js",revision:null},{url:"_nuxt/scout.3b19c2ec.js",revision:null},{url:"_nuxt/sitemap.0ddffa11.js",revision:null},{url:"_nuxt/theAside.25406460.css",revision:null},{url:"_nuxt/theAside.vue.38d92f85.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.73a65ec8.js",revision:null},{url:"_nuxt/useMobileMenuBtn.379fdd71.js",revision:null},{url:"_nuxt/vitalcrm-app.2780bd43.js",revision:null},{url:"_nuxt/vitalsespsurvey.8a1a3095.js",revision:null},{url:"_nuxt/vitaluikit.8394a8b8.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.8e744ba2.js",revision:null},{url:"_nuxt/zh-Hant-TW.08e5ac23.js",revision:null},{url:"200",revision:"b2f4b2bc74565dafc336ce807d499b98"},{url:"404",revision:"b2f4b2bc74565dafc336ce807d499b98"},{url:"about",revision:"9191b0dab2ef24c17aee49dd4b00ac17"},{url:"en/about",revision:"f280dcac201aee6d9ab07958a3a5c559"},{url:"en",revision:"69470e423431d2720e3c238a4ddbe7f3"},{url:"en/sitemap",revision:"b6a56f07841e548d6419f9035990ce49"},{url:"en/works/choose-chart",revision:"48c650eb34201a9edb2692ea96acc6bd"},{url:"en/works",revision:"294747466a03e58f5fcbccd022350c0c"},{url:"en/works/mpos",revision:"ebcb632b8924731885c3b1533596be00"},{url:"en/works/piman",revision:"9df712df68d8670fd8fde83030e76cb1"},{url:"en/works/scout",revision:"25e361cb29ac61efba1f0d5a34816557"},{url:"en/works/vitalcrm-app",revision:"7430714d71cf80c3e1f65682d1890e19"},{url:"en/works/vitalsespsurvey",revision:"cd28400e624fe82dbcc3c54cd921b040"},{url:"en/works/vitaluikit",revision:"229993f0be294e73e68d1731ff821ea0"},{url:"/portfolio/",revision:"fa90b9413110c517f6790fe2ef8db654"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"d9abcf1ca76fe02b603103ded8d037d1"},{url:"works/choose-chart",revision:"83aed34d6dc832a3a56e851740d09502"},{url:"works",revision:"438f60eaf592dc2f6e26c8fd344a9cd8"},{url:"works/mpos",revision:"e556c5843051641dc1567c690f3fb203"},{url:"works/piman",revision:"63740171747bf65aab217398ffd0d462"},{url:"works/scout",revision:"6243658f85d49cca642cabf08d4b715a"},{url:"works/vitalcrm-app",revision:"0df00185bc5f7ad63e2c12177317dd3f"},{url:"works/vitalsespsurvey",revision:"5b1b19928d112034feb4cafbc13ad67d"},{url:"works/vitaluikit",revision:"bc866519ed67ef7e939765ecd68f02dc"},{url:"manifest.webmanifest",revision:"10e389680c8fca350ec43f354700f043"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
