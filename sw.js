if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,u)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(r[l])return;let s={};const o=e=>n(e,l),t={module:{uri:l},exports:s,require:o};r[l]=Promise.all(i.map((e=>t[e]||o(e)))).then((e=>(u(...e),s)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.c7d5fe51.js",revision:null},{url:"_nuxt/akContainer.8d7b3a57.js",revision:null},{url:"_nuxt/choose-chart.ae46fd38.js",revision:null},{url:"_nuxt/default.d2efeaa6.css",revision:null},{url:"_nuxt/default.ffb4e1fb.js",revision:null},{url:"_nuxt/entry.2d04bb1e.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.fbcf39eb.js",revision:null},{url:"_nuxt/error-500.32ffa21e.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-component.37434f79.js",revision:null},{url:"_nuxt/index.43717ba0.js",revision:null},{url:"_nuxt/mpos.6a35a1e4.js",revision:null},{url:"_nuxt/nuxt-link.fc80dded.js",revision:null},{url:"_nuxt/piman.119a3ea5.js",revision:null},{url:"_nuxt/scout.3de2e97e.js",revision:null},{url:"_nuxt/sitemap.16f27d92.js",revision:null},{url:"_nuxt/theAside.vue.059f076f.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.cbef4448.js",revision:null},{url:"_nuxt/useMobileMenuBtn.e4109571.js",revision:null},{url:"_nuxt/vitalcrm-app.3673d426.js",revision:null},{url:"_nuxt/vitalsespsurvey.fe832de0.js",revision:null},{url:"_nuxt/vitaluikit.56845e9d.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.0e98a6cf.js",revision:null},{url:"200",revision:"2129c422f841da3cbe81569b8454033d"},{url:"404",revision:"2129c422f841da3cbe81569b8454033d"},{url:"about",revision:"d1bccce3cd09616f7e001fcd8444307c"},{url:"/portfolio/",revision:"9b74ca9834b38dee3809a3cb7c47398b"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"1fdba85821c412b3bb1f0f22e7570307"},{url:"works/choose-chart",revision:"a6315c8962b56e726ff8c5344b917ea0"},{url:"works",revision:"a6d37d4d78e274809ecf751c3093c541"},{url:"works/mpos",revision:"497e6c344fda0aa5d06de75bba3fbf74"},{url:"works/piman",revision:"7fe9a04ece575e14187dd96ade055817"},{url:"works/scout",revision:"80ea70ade13630abb2dc4e44e591a3f8"},{url:"works/vitalcrm-app",revision:"fe867629c02972435ca0dbef4dbcd547"},{url:"works/vitalsespsurvey",revision:"88ee556ae7b81aafc18569fcd1f0eedf"},{url:"works/vitaluikit",revision:"e44f2f72a17f975ddced7421bccccb0d"},{url:"manifest.webmanifest",revision:"bae41b39bf197612711744e3b3a2e5da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));