import enUS from "./i18n/lang/en-US";
import zhHantTW from "./i18n/lang/zh-Hant-TW";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/portfolio/",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    "@nuxt/eslint",
    "nuxt-gtag",
    // "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/html-validator",
  ],

  gtag: {
    id: "G-3JHEDXCEG0",
  },

  // pwa: {
  //   registerType: "autoUpdate",
  //   manifest: {
  //     id: "/",
  //     start_url: "/",
  //     name: "Neil 的作品集",
  //     short_name: "Neil's Portfolio",
  //     categories: [
  //       "web design",
  //       "accessibility",
  //       "data visualization",
  //       "UI",
  //       "UX",
  //     ],
  //     shortcuts: [
  //       {
  //         name: "About 我的技能",
  //         short_name: "About 關於",
  //         url: "/about",
  //         description: "List of events planned for today",
  //         icons: [
  //           {
  //             src: "/favicon-96.png",
  //             sizes: "96x96",
  //             type: "image/png",
  //           },
  //         ],
  //       },
  //     ],
  //     description: "Neil 的作品集",
  //     theme_color: "#6042a0",
  //     icons: [
  //       {
  //         src: "/favicon-32.png",
  //         sizes: "32x32",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/favicon-64.png",
  //         sizes: "64x64",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/favicon-96.png",
  //         sizes: "96x96",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/favicon-144.png",
  //         sizes: "144x144",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/favicon-192.png",
  //         sizes: "192x192",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/favicon-512.png",
  //         sizes: "512x512",
  //         type: "image/png",
  //       },
  //     ],
  //     screenshots: [
  //       {
  //         src: "/images/splash/splash-640x1136.png",
  //         type: "image/png",
  //         sizes: "640x1136",
  //         label: "Portfolio",
  //       },
  //       {
  //         src: "/images/splash/splash-1242x2208.png",
  //         type: "image/png",
  //         sizes: "1242x2208",
  //         label: "Portfolio",
  //       },
  //     ],
  //   },
  //   workbox: {
  //     navigateFallback: "/",
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: "module",
  //   },
  // },

  i18n: {
    vueI18n: "./i18n.config.ts",
    baseUrl: "/",
    locales: [
      {
        code: "zh-Hant-TW",
        language: "zh-Hant-TW",
        dir: "ltr",
        name: "繁體中文",
        file: "zh-Hant-TW.ts",
      },
      {
        code: "en",
        language: "en-US",
        dir: "ltr",
        name: "English",
        file: "en-US.ts",
      },
    ],
    lazy: true,
    langDir: "lang",
    // strategy: 'prefix',
    defaultLocale: "zh-Hant-TW",
    detectBrowserLanguage: false,
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   alwaysRedirect: true,
    //   cookieCrossOrigin: true
    // }
  },

  htmlValidator: {
    usePrettier: true,
  },

  runtimeConfig: {
    env: "",
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    public: {
      baseUrl:
        process.env.NUXT_PUBLIC_BASE_URL ||
        "https://neil-lin.github.io/portfolio",
      websiteName: {
        "zh-Hant-TW":
          process.env.NUXT_PUBLIC_WEBSITE_NAME_ZHHANTTW ||
          zhHantTW.website.name,
        en: process.env.NUXT_PUBLIC_WEBSITE_NAME_EN || enUS.website.name,
      },
      websiteDescription: {
        "zh-Hant-TW":
          process.env.NUXT_PUBLIC_WEBSITE_DES_ZHHANTTW || zhHantTW.website.des,
        en: process.env.NUXT_PUBLIC_WEBSITE_DES_EN || enUS.website.des,
      },
    },
  },
});
