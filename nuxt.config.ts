// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/portfolio/',
    // pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: ['@vite-pwa/nuxt', '@nuxtjs/i18n', '@nuxtjs/html-validator'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Neil 的作品集',
      short_name: 'Neil Portfolio',
      shortcuts : [
        {
          name: 'About 我的技能',
          url: '/portfolio/about',
          description: 'List of events planned for today'
        },
        {
          "name": "Medium",
          "url": "https://medium.com/@neil-lin"
        },
        {
          "name": "Dribbble",
          "url": "https://dribbble.com/Neil_lin"
        }
      ],
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
      ],
      screenshots: [
        {
          src: '/portfolio/images/splash/splash-640x1136.png',
          type: 'image/png',
          sizes: '640x1136',
          label: 'Portfolio'
        },
        {
          src: '/portfolio/images/splash/splash-1242x2208.png',
          type: 'image/png',
          sizes: '1242x2208',
          label: 'Portfolio'
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
        name: '繁體中文',
        file: 'zh-Hant-TW.ts'
      },
      {
        code: 'en',
        iso: 'en-US',
        dir: "ltr",
        name: 'English',
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
  htmlValidator: {
    usePrettier: true
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
