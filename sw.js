if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>n(e,u),a={module:{uri:u},exports:l,require:o};r[u]=Promise.all(i.map((e=>a[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"__i18n__/prerender/aa090fbd.js",revision:"e707a914669db2b7370df131ad9f6e18"},{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.11e714af.js",revision:null},{url:"_nuxt/akContainer.70ec1072.js",revision:null},{url:"_nuxt/choose-chart.c7863ad4.js",revision:null},{url:"_nuxt/composables.8adf2e04.js",revision:null},{url:"_nuxt/default.9833e267.css",revision:null},{url:"_nuxt/default.fdf197c0.js",revision:null},{url:"_nuxt/en-US.dc0a7c19.js",revision:null},{url:"_nuxt/entry.d8f37354.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.aa15d075.js",revision:null},{url:"_nuxt/error-500.03092456.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-component.5eddc771.js",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.961b45c2.js",revision:null},{url:"_nuxt/index.fcd06112.js",revision:null},{url:"_nuxt/mpos.5a6194d0.js",revision:null},{url:"_nuxt/nuxt-link.411bb035.js",revision:null},{url:"_nuxt/piman.bb179a43.js",revision:null},{url:"_nuxt/scout.342317c8.js",revision:null},{url:"_nuxt/sitemap.1432e1c6.js",revision:null},{url:"_nuxt/theAside.vue.95a13f4b.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.e93c56c0.js",revision:null},{url:"_nuxt/useMobileMenuBtn.10afc0b3.js",revision:null},{url:"_nuxt/vitalcrm-app.e3168272.js",revision:null},{url:"_nuxt/vitalsespsurvey.e9d7cc48.js",revision:null},{url:"_nuxt/vitaluikit.62531583.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.c49af364.js",revision:null},{url:"_nuxt/zh-Hant-TW.08e5ac23.js",revision:null},{url:"200",revision:"de31437844a0d1416b604580c779c6c7"},{url:"404",revision:"de31437844a0d1416b604580c779c6c7"},{url:"about",revision:"4eb3f8da712de4035a01745a91a34097"},{url:"en/about",revision:"f93372666db0b1398f60ea0f38b3e7cc"},{url:"en",revision:"30ad72cbb8caccef6e6e38d53ee12239"},{url:"en/sitemap",revision:"1d50b58b788efa27f0eba336d07cec9e"},{url:"en/works/choose-chart",revision:"8e04b32153e85dec6324ba137a5f7e8a"},{url:"en/works",revision:"d71ef824ba82f036526dd90a9cf90ed4"},{url:"en/works/mpos",revision:"4f1d1eca00a64ee83b25a3979bfe8984"},{url:"en/works/piman",revision:"02e39e9f5bda5f823b61ffcc2c1896c7"},{url:"en/works/scout",revision:"0e3dbd1c0e43467f73f86f01330aef20"},{url:"en/works/vitalcrm-app",revision:"cd648531e97cd25d9479f1cd0fbb171d"},{url:"en/works/vitalsespsurvey",revision:"a718697853d2a9fcc507a3826596d985"},{url:"en/works/vitaluikit",revision:"c870112ccb27ccf4bb4cadece8a3200d"},{url:"/portfolio/",revision:"56f66a3efdbe86ff0bd17fa8b41ee0fe"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"985c572c7cbecd93f1fa48ab46b5fffb"},{url:"works/choose-chart",revision:"2feac776057e136d719120de291eedc5"},{url:"works",revision:"45d2892ea9030fc039f0d46ba7306cb4"},{url:"works/mpos",revision:"863e8156bb5f4e3dd6f35aec517917c2"},{url:"works/piman",revision:"346881abde6349fdd2d2f3bfd53caefe"},{url:"works/scout",revision:"3a28cc7574ca9650cabe680383f6dcf0"},{url:"works/vitalcrm-app",revision:"87fac25b2b9cb0771080ab96a90f4df4"},{url:"works/vitalsespsurvey",revision:"2c7d5ead41686d25ae127c4871a7b14b"},{url:"works/vitaluikit",revision:"168c3d3eb0a4cb7a532c80f3b669817b"},{url:"manifest.webmanifest",revision:"bae41b39bf197612711744e3b3a2e5da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
