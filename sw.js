if(!self.define){let e,r={};const n=(n,i)=>(n=new URL(n+".js",i).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,s)=>{const u=e||("document"in self?document.currentScript.src:"")||location.href;if(r[u])return;let l={};const o=e=>n(e,u),a={module:{uri:u},exports:l,require:o};r[u]=Promise.all(i.map((e=>a[e]||o(e)))).then((e=>(s(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"__i18n__/prerender/aa090fbd.js",revision:"e707a914669db2b7370df131ad9f6e18"},{url:"_nuxt/_plugin-vue_export-helper.c27b6911.js",revision:null},{url:"_nuxt/about.2dad3f72.js",revision:null},{url:"_nuxt/akContainer.47886dd7.js",revision:null},{url:"_nuxt/choose-chart.29f71069.js",revision:null},{url:"_nuxt/composables.ec810964.js",revision:null},{url:"_nuxt/default.aa7e91bf.css",revision:null},{url:"_nuxt/default.f9fe941e.js",revision:null},{url:"_nuxt/en-US.dc0a7c19.js",revision:null},{url:"_nuxt/entry.bbdc995b.js",revision:null},{url:"_nuxt/error-404.23f2309d.css",revision:null},{url:"_nuxt/error-404.73f4c6c0.js",revision:null},{url:"_nuxt/error-500.9e7f2249.js",revision:null},{url:"_nuxt/error-500.aa16ed4d.css",revision:null},{url:"_nuxt/error-component.9ecedcf1.js",revision:null},{url:"_nuxt/i18n.config.2d2f2de3.js",revision:null},{url:"_nuxt/i18n.options.ec942af1.js",revision:null},{url:"_nuxt/index.6bbe1b23.js",revision:null},{url:"_nuxt/mpos.ce06e79c.js",revision:null},{url:"_nuxt/nuxt-link.0ea40371.js",revision:null},{url:"_nuxt/piman.bcd62ce1.js",revision:null},{url:"_nuxt/scout.637d0a26.js",revision:null},{url:"_nuxt/sitemap.84654865.js",revision:null},{url:"_nuxt/theAside.vue.ec3d0d5d.js",revision:null},{url:"_nuxt/theBreadcrumb.vue.307fe6ae.js",revision:null},{url:"_nuxt/useMobileMenuBtn.3417b38b.js",revision:null},{url:"_nuxt/vitalcrm-app.bccf1f32.js",revision:null},{url:"_nuxt/vitalsespsurvey.21cada55.js",revision:null},{url:"_nuxt/vitaluikit.898d98d9.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"_nuxt/works.61d24f4c.js",revision:null},{url:"_nuxt/zh-Hant-TW.08e5ac23.js",revision:null},{url:"200",revision:"ca4fa507bed15f98d425709917c30a41"},{url:"404",revision:"ca4fa507bed15f98d425709917c30a41"},{url:"about",revision:"6bfa71caff4ee6f0c5ffc1f80ba0cace"},{url:"en/about",revision:"5793daebf8c2711ca7a788619aa09a3c"},{url:"en",revision:"00daa7aa8e042d14d8022dd1125fa625"},{url:"en/sitemap",revision:"019acb2bedcb8d7316fecddb62734b80"},{url:"en/works/choose-chart",revision:"ace448f3d9673ad2438f6caa220590c8"},{url:"en/works",revision:"1e4c31eb5ad0ef1880af0d081086e4ee"},{url:"en/works/mpos",revision:"69752402abc22b1f51b29487c681ee12"},{url:"en/works/piman",revision:"368f1ac9515f435c5e2a9a141122555c"},{url:"en/works/scout",revision:"01e4ae1de7927e85aaa3f8b47e7ba2b4"},{url:"en/works/vitalcrm-app",revision:"66f9c3f7d89b6d95516a714dd02d4df5"},{url:"en/works/vitalsespsurvey",revision:"2ab2c1fa41f3643cb4c64b1554d4543a"},{url:"en/works/vitaluikit",revision:"42a5030ea904fc5cb9a89aa2f0b989ad"},{url:"/portfolio/",revision:"814a5c976889f9658c8a0fe9acb64df3"},{url:"js/clarity.js",revision:"872f1e66ea37a201f66521f76eacaba2"},{url:"sitemap",revision:"738d91727acd5b7dbc465a69a2dbd033"},{url:"works/choose-chart",revision:"c8c05653f512551d30250656f1f048c6"},{url:"works",revision:"b4945cf6767d65bf47e9a9579ed51a3e"},{url:"works/mpos",revision:"5d8f11c0a05254bd7b86694e6a996e9a"},{url:"works/piman",revision:"7e64b609fc5d607eec745ef70ebd8971"},{url:"works/scout",revision:"26bfd80c0c7fcb9b0a8ff01c32c296c9"},{url:"works/vitalcrm-app",revision:"5118ec6cd1da37c325b4a65213c75272"},{url:"works/vitalsespsurvey",revision:"6a4960aa1f80586bffd38a078a8450e4"},{url:"works/vitaluikit",revision:"38763702e40ff6bfba3e80a6e6c15691"},{url:"manifest.webmanifest",revision:"bae41b39bf197612711744e3b3a2e5da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
