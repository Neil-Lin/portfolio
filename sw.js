if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,u)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(r[l])return;let s={};const o=e=>n(e,l),t={module:{uri:l},exports:s,require:o};r[l]=Promise.all(i.map((e=>t[e]||o(e)))).then((e=>(u(...e),s)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.95abe8bf.js",revision:null},{url:"_nuxt/akContainer.e9cd2fcf.js",revision:null},{url:"_nuxt/choose-chart.da0d1ec9.js",revision:null},{url:"_nuxt/default.30507646.js",revision:null},{url:"_nuxt/default.bd44e879.css",revision:null},{url:"_nuxt/entry.480734f7.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.5fbdf274.js",revision:null},{url:"_nuxt/error-500.a1cbf6fa.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-component.9f015c96.js",revision:null},{url:"_nuxt/index.822f4a33.js",revision:null},{url:"_nuxt/mpos.d33900f0.js",revision:null},{url:"_nuxt/nuxt-link.72adda14.js",revision:null},{url:"_nuxt/piman.8d20c5c9.js",revision:null},{url:"_nuxt/scout.2e8b75fd.js",revision:null},{url:"_nuxt/sitemap.5cb1dd17.js",revision:null},{url:"_nuxt/theAside.vue.bc078310.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.6ca770b2.js",revision:null},{url:"_nuxt/useMobileMenuBtn.8559d651.js",revision:null},{url:"_nuxt/vitalcrm-app.c60e360f.js",revision:null},{url:"_nuxt/vitalsespsurvey.ac0ef574.js",revision:null},{url:"_nuxt/vitaluikit.e31abdea.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.3e9bda5c.js",revision:null},{url:"200",revision:"378ffb3cc3a6aa66804a9685c0c69b63"},{url:"404",revision:"378ffb3cc3a6aa66804a9685c0c69b63"},{url:"about",revision:"118ad96278df3e9ec34070a047ac80ed"},{url:"/portfolio/",revision:"02f786c184f8b61f48efa783c2e1ce19"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"872cbb98e79998c9699dd80082830781"},{url:"works/choose-chart",revision:"b78a191869f4d9340002c1c3bae639b6"},{url:"works",revision:"535dd75ee5334f768d624b493717e4c0"},{url:"works/mpos",revision:"4187880d55a18939534fdedd82f304ad"},{url:"works/piman",revision:"fa0b84e710d89673689e6fc11a7f417c"},{url:"works/scout",revision:"f2be624e6b51c20f29c28010d58547e7"},{url:"works/vitalcrm-app",revision:"d610778d0f0f296b4ea4ba4c01e2840e"},{url:"works/vitalsespsurvey",revision:"49563c064bf81f8fa35ace280d2cf063"},{url:"works/vitaluikit",revision:"f01c9fc200f2758f0a82a73bf5d23611"},{url:"manifest.webmanifest",revision:"bae41b39bf197612711744e3b3a2e5da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
