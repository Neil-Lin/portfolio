if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>n(e,u),c={module:{uri:u},exports:l,require:o};r[u]=Promise.all(i.map((e=>c[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.e684f41e.js",revision:null},{url:"_nuxt/akContainer.55f78a27.js",revision:null},{url:"_nuxt/choose-chart.f1816828.js",revision:null},{url:"_nuxt/composables.d8005a27.js",revision:null},{url:"_nuxt/default.22795f1c.css",revision:null},{url:"_nuxt/default.ea91728c.js",revision:null},{url:"_nuxt/en-US.5fa9b2e2.js",revision:null},{url:"_nuxt/entry.554eb2f0.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.b8888033.js",revision:null},{url:"_nuxt/error-500.8e7797e7.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.a31ba95c.js",revision:null},{url:"_nuxt/index.29b6c448.js",revision:null},{url:"_nuxt/mpos.db87be21.js",revision:null},{url:"_nuxt/nuxt-link.b18afe4d.js",revision:null},{url:"_nuxt/piman.655e98bd.js",revision:null},{url:"_nuxt/scout.4dfd5f99.js",revision:null},{url:"_nuxt/sitemap.50515fc1.js",revision:null},{url:"_nuxt/theAside.7442d1a5.css",revision:null},{url:"_nuxt/theAside.vue.46f931f4.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.7fcdba2c.js",revision:null},{url:"_nuxt/useMobileMenuBtn.e8605c04.js",revision:null},{url:"_nuxt/vitalcrm-app.01f49bee.js",revision:null},{url:"_nuxt/vitalsespsurvey.2392bcbc.js",revision:null},{url:"_nuxt/vitaluikit.054e8ab0.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.29ef863b.js",revision:null},{url:"_nuxt/zh-Hant-TW.f4dec575.js",revision:null},{url:"200",revision:"6c950840836e19b6301235cecf0e5c60"},{url:"404",revision:"6c950840836e19b6301235cecf0e5c60"},{url:"about",revision:"5ab101ba47c2789db94f7ef48fb76d7b"},{url:"en/about",revision:"8617718a316de5fed7d023c9720c012c"},{url:"en",revision:"3431d94f9c4b544e5a4ea414545ba875"},{url:"en/sitemap",revision:"15e53182cc3e07f0c6ce15d1747ea340"},{url:"en/works/choose-chart",revision:"04cc9065ec1f6201fdb6695436d3cd16"},{url:"en/works",revision:"169a1a5b27090a8d75f9deeac3ae90f3"},{url:"en/works/mpos",revision:"47c471a8795099c4b01d7321a643d0ce"},{url:"en/works/piman",revision:"dc96fa706b1995a175f46ec0ef6497e7"},{url:"en/works/scout",revision:"a5320202b1faa7585ddbf2d9991d8b41"},{url:"en/works/vitalcrm-app",revision:"8dc4d801c36d071521cb2a8a1d08b2e5"},{url:"en/works/vitalsespsurvey",revision:"80ed80ff3f00ab8f2b55e98e4f63b5ce"},{url:"en/works/vitaluikit",revision:"cd76b6f4781657eb0f7d13d603405c18"},{url:"/portfolio/",revision:"7f395492ebd2980ce392707da362ec3e"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"1543eae799b849b6893d0cbbbc278be3"},{url:"works/choose-chart",revision:"82197c17c714bf71127fbbaca9c55b15"},{url:"works",revision:"0e0d5d8c0ab3326d6407ca15638b4389"},{url:"works/mpos",revision:"e0ca9364c82dec75431f36b06a0c4702"},{url:"works/piman",revision:"b14abaf25862c8b487808a7c7dd7fdf9"},{url:"works/scout",revision:"fdc4637ba3c4b97b9d63473205fe23b6"},{url:"works/vitalcrm-app",revision:"36f66a47825176f9749d2fbd2d136dbb"},{url:"works/vitalsespsurvey",revision:"60c01097b6abe77916fe34c6d3f1c868"},{url:"works/vitaluikit",revision:"c125f7d4efc8ce6bcb48ac36c4b348a1"},{url:"manifest.webmanifest",revision:"10e389680c8fca350ec43f354700f043"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
