// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/portfolio/',
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: ['@vite-pwa/nuxt', '@nuxtjs/i18n'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Neil 的作品集',
      short_name: 'Neil Portfolio',
      description: 'Neil 的作品集',
      theme_color: '#6042a0',
      icons: [
        {
          src: '/portfolio/favicon-32.png',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: '/portfolio/favicon-64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/portfolio/favicon-144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/portfolio/favicon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/portfolio/favicon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  // routeRules: {
  //   "/": { redirect: "/portfolio/zh-Hant-TW" },
  // },
  i18n: {
    vueI18n: "./i18n.config.ts",
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    locales: [
      {
        code: 'zh-Hant-TW',
        iso: 'zh-Hant-TW',
        dir: "ltr",
        name: '繁體',
        file: 'zh-Hant-TW.ts'
      },
      {
        code: 'en',
        iso: 'en-US',
        dir: "ltr",
        name: 'EN',
        file: 'en-US.ts'
      }
    ],
    lazy: true,
    langDir: 'lang',
    // strategy: 'prefix',
    defaultLocale: 'zh-Hant-TW',
    detectBrowserLanguage: false
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   alwaysRedirect: true,
    //   cookieCrossOrigin: true
    // }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    }
  },
  typescript: {
    typeCheck: true
  },
  devtools: {
    enabled: false
  }
})
