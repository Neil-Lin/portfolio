if(!self.define){let e,r={};const i=(i,n)=>(i=new URL(i+".js",n).href,r[i]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=r,document.head.appendChild(e)}else e=i,importScripts(i),r()})).then((()=>{let e=r[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>i(e,u),a={module:{uri:u},exports:l,require:o};r[u]=Promise.all(n.map((e=>a[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.cdf66890.js",revision:null},{url:"_nuxt/akContainer.4f891ecb.js",revision:null},{url:"_nuxt/choose-chart.2bb360d0.js",revision:null},{url:"_nuxt/composables.3702030b.js",revision:null},{url:"_nuxt/default.4d72677c.css",revision:null},{url:"_nuxt/default.7a597680.js",revision:null},{url:"_nuxt/en-US.5fa9b2e2.js",revision:null},{url:"_nuxt/entry.0041034a.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.f7cad8a8.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-500.d54f10d7.js",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.09ef69ab.js",revision:null},{url:"_nuxt/index.8a25204a.js",revision:null},{url:"_nuxt/mpos.5bb0e00e.js",revision:null},{url:"_nuxt/nuxt-link.4c71ed05.js",revision:null},{url:"_nuxt/piman.9a3c96f0.js",revision:null},{url:"_nuxt/scout.76a238e7.js",revision:null},{url:"_nuxt/sitemap.35bc46fd.js",revision:null},{url:"_nuxt/theAside.96776efa.css",revision:null},{url:"_nuxt/theAside.vue.1509ac84.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.680150d0.js",revision:null},{url:"_nuxt/vitalcrm-app.6f79ec0a.js",revision:null},{url:"_nuxt/vitalsespsurvey.d2b224fc.js",revision:null},{url:"_nuxt/vitaluikit.d83aa6dc.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.5f9a03d5.js",revision:null},{url:"_nuxt/zh-Hant-TW.f4dec575.js",revision:null},{url:"200",revision:"1e7e40a24797b790138db67de9186878"},{url:"404",revision:"1e7e40a24797b790138db67de9186878"},{url:"about",revision:"cc75f9ab8d99cf8f7a0815095577d426"},{url:"en/about",revision:"5a1ebaf5f6a4177c521967fa75ccb34b"},{url:"en",revision:"8e434ffea7001eda3beb7f6887f4ae79"},{url:"en/sitemap",revision:"1d835d9a20187446f7d460932da7fdf5"},{url:"en/works/choose-chart",revision:"3bf59313785da69becdca11504d45329"},{url:"en/works",revision:"ce4eee763f7111e6da06640c61845b2d"},{url:"en/works/mpos",revision:"d6695f5264663d40de506213f5d2dc64"},{url:"en/works/piman",revision:"c1e0b5de3b45d86a12ea904f8f016920"},{url:"en/works/scout",revision:"f19733a59c1c6e29024274d2bf5405b7"},{url:"en/works/vitalcrm-app",revision:"adec753e0ec4710592c1c4e4b4c5c34d"},{url:"en/works/vitalsespsurvey",revision:"9991e6bc8fe571e2664040bca255b323"},{url:"en/works/vitaluikit",revision:"9dbc7f4964abf2d9497ec0421c40464f"},{url:"/portfolio/",revision:"af0a9e4aeba08494387a2f4be34e6572"},{url:"js/clarity.js",revision:"8e03800d0928fc69aed7d28e87910181"},{url:"sitemap",revision:"e72e322f9e1bfcd6b00c2819c246590c"},{url:"works/choose-chart",revision:"d755208bc48c62f1f29fda8ae9822eb4"},{url:"works",revision:"def2c824fcf399c6b5e9b654b4379fb7"},{url:"works/mpos",revision:"1b5850dbaf444ba1a671e967bb568fe2"},{url:"works/piman",revision:"f125de62c714ca87ec40a4e738b7cbe1"},{url:"works/scout",revision:"2f600ec4698562d822afb14ab7237b20"},{url:"works/vitalcrm-app",revision:"a318e549f4e59f3c72cf44cc6365f901"},{url:"works/vitalsespsurvey",revision:"dc794aaad1daf6e0d16c83022ff1ca6a"},{url:"works/vitaluikit",revision:"3ba0b911c209ff9e0123f45524547630"},{url:"manifest.webmanifest",revision:"fba17d0338a1ecbb2d568b966a81b838"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
