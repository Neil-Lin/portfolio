if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,u)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(r[l])return;let s={};const o=e=>n(e,l),a={module:{uri:l},exports:s,require:o};r[l]=Promise.all(i.map((e=>a[e]||o(e)))).then((e=>(u(...e),s)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.197e6fba.js",revision:null},{url:"_nuxt/akContainer.9e9c26fa.js",revision:null},{url:"_nuxt/choose-chart.7f7ff3b4.js",revision:null},{url:"_nuxt/default.05cd519c.css",revision:null},{url:"_nuxt/default.f3108576.js",revision:null},{url:"_nuxt/entry.a5acb535.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.5c1b745a.js",revision:null},{url:"_nuxt/error-500.a53a6c88.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-component.1075bcb8.js",revision:null},{url:"_nuxt/index.5f121ac9.js",revision:null},{url:"_nuxt/mpos.a2408edc.js",revision:null},{url:"_nuxt/nuxt-link.310c9d64.js",revision:null},{url:"_nuxt/piman.64c6562f.js",revision:null},{url:"_nuxt/scout.b88a37f9.js",revision:null},{url:"_nuxt/sitemap.3993fc78.js",revision:null},{url:"_nuxt/theAside.vue.e67ae68c.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.2d3956e8.js",revision:null},{url:"_nuxt/useMobileMenuBtn.3cd8347b.js",revision:null},{url:"_nuxt/vitalcrm-app.a2173124.js",revision:null},{url:"_nuxt/vitalsespsurvey.97fd03b6.js",revision:null},{url:"_nuxt/vitaluikit.6340f95a.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.f398b3cd.js",revision:null},{url:"200",revision:"91ca08752f7627142a7baf710f637c8c"},{url:"404",revision:"91ca08752f7627142a7baf710f637c8c"},{url:"about",revision:"763077664a6e4d1e153deafbc7a89036"},{url:"/portfolio/",revision:"885111af96f6c2a45acc9eff4fcaf259"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"5008160176ebae45c61f7640df1952c2"},{url:"works/choose-chart",revision:"7d3d85c045cc9a0298c81790d8aa1b86"},{url:"works",revision:"498cfec8a45758a0c666803e30631c57"},{url:"works/mpos",revision:"755a5b3107623e744ee4910b65060984"},{url:"works/piman",revision:"fab52987431249a449ec4f3f5c5b0b47"},{url:"works/scout",revision:"e2e06f28ddff140a3a3d526ba2513b57"},{url:"works/vitalcrm-app",revision:"cba7d98ba157d7328ec531e178754932"},{url:"works/vitalsespsurvey",revision:"13d86b95143ccb3b440c8ea26a4e294f"},{url:"works/vitaluikit",revision:"e4a1b470edb96329770d5a5c447d661c"},{url:"manifest.webmanifest",revision:"bae41b39bf197612711744e3b3a2e5da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
