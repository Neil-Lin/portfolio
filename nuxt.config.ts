import enUS from "./i18n/lang/en-US";
import zhHantTW from "./i18n/lang/zh-Hant-TW";
import { productsData } from "./data/productsData";
import { validateContentData } from "./scripts/checkData";
import { getBlogRoutes } from "./scripts/blogRoutes";

// 內容資料驗證：路徑不存在或 slug 重複時直接讓 build 失敗
validateContentData();

const blogRoutes = getBlogRoutes();

const fallbackBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://neillin.com"
    : "http://localhost:3000";
const siteUrl = process.env.NUXT_PUBLIC_BASE_URL || fallbackBaseUrl;

const dynamicRoutes = productsData
  .filter((p) => p.clickable)
  .flatMap((p) => [`/products/${p.slug}`, `/en/products/${p.slug}`]);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/og-fonts.css"],
  app: {
    baseURL: "/",
    head: {
      htmlAttrs: {
        lang: "zh-Hant-TW",
        dir: "ltr",
      },
      title: zhHantTW.website.name,
      script: [
        {
          src: "https://accesserty.com/pulse.js",
          defer: true,
          // 這是您的專屬追蹤 ID
          "data-client-id": "Partner_MJRBV4ZI_850",
        },
      ],
      // iOS 起始畫面（apple-touch-startup-image）；圖由 scripts/genSplash.mjs 產生
      link: [
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-750x1334.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1242x2208.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1125x2436.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-828x1792.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1242x2688.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1170x2532.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1284x2778.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1179x2556.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
          href: "/images/apple-splash-1290x2796.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-1536x2048.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-1620x2160.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-1668x2224.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-1668x2388.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-1640x2360.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
          href: "/images/apple-splash-2048x2732.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-1334x750.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2208x1242.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2436x1125.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-1792x828.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2688x1242.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2532x1170.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2778x1284.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2556x1179.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
          href: "/images/apple-splash-2796x1290.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2048x1536.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2160x1620.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2224x1668.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2388x1668.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2360x1640.png",
        },
        {
          rel: "apple-touch-startup-image",
          media:
            "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
          href: "/images/apple-splash-2732x2048.png",
        },
      ],
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: true,
  nitro: {
    trailingSlash: false,
    prerender: {
      // 所有路由都由下方 routes 決定論式列出（含部落格文章），
      // 關閉 crawlLinks：文章內若有壞連結也不會連累整個 build 失敗
      crawlLinks: false,
      routes: [
        "/",
        "/products",
        "/projects",
        "/blog",
        "/sitemap",
        "/en",
        "/en/products",
        "/en/projects",
        "/en/blog",
        "/en/sitemap",
        "/rss.xml",
        "/en/rss.xml",
        ...dynamicRoutes,
        ...blogRoutes,
      ],
    },
  },
  modules: [
    "@nuxt/eslint",
    "nuxt-gtag",
    "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "nuxt-clarity-analytics",
    "@nuxt/fonts",
    "@nuxt/content",
  ],

  content: {
    build: {
      markdown: {
        highlight: {
          theme: { default: "github-light", "github-dark": "github-dark" },
          langs: [
            "vue",
            "ts",
            "js",
            "json",
            "html",
            "css",
            "scss",
            "bash",
            "md",
            "yaml",
            "diff",
          ],
        },
      },
    },
  },

  // 連結檢查只警告、不中斷 build：文章內單一壞連結不該擋住整個部署
  linkChecker: {
    failOnError: false,
  },

  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      id: "/",
      start_url: siteUrl,
      name: "Neil's Portfolio",
      short_name: "Neil's Portfolio",
      categories: [
        "web design",
        "accessibility",
        "data visualization",
        "UI",
        "UX",
      ],
      shortcuts: [
        {
          name: "products",
          short_name: "products",
          url: siteUrl + "/products",
          description: "about products of portfolio",
          icons: [
            {
              src: siteUrl + "/favicon-96.png",
              sizes: "96x96",
              type: "image/png",
            },
          ],
        },
      ],
      description: "Neil's Portfolio",
      theme_color: "#6042a0",
      icons: [
        { src: "/favicon-64.png", sizes: "64x64", type: "image/png" },
        { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
        {
          src: "/favicon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/favicon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots: [
        {
          src: "/images/splash/splash-640x1136.png",
          type: "image/png",
          sizes: "640x1136",
          label: "Portfolio",
        },
        {
          src: "/images/splash/splash-1242x2208.png",
          type: "image/png",
          sizes: "1242x2208",
          label: "Portfolio",
        },
      ],
    },
    workbox: {
      navigateFallback: null,
      cleanupOutdatedCaches: true,
    },
    devOptions: {
      enabled: false,
      type: "module",
      navigateFallbackAllowlist: [/^\/$/],
    },
  },

  i18n: {
    baseUrl: siteUrl,
    vueI18n: "./i18n.config.ts",
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
    baseUrl: siteUrl,
    public: {
      buildDate: (() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      })(),
      baseUrl: siteUrl,
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

  robots: {
    header: false,
    robotsTxt: true,
    sitemap: `${siteUrl}/sitemap_index.xml`,
  },

  site: {
    url: siteUrl,
    name: "Neil's portfolio",
    autoLastmod: true,
    cacheMaxAgeSecond: 3600,
  },

  sitemap: {
    excludeAppSources: true,
    sources: ["/api/__sitemap__/urls"],
    // 讓 sitemap index 的子 sitemap 帶 <lastmod>，每次部署更新；
    // 給 Google「sitemap 變了，請重讀」的訊號（這是它判斷是否重抓的依據）
    autoLastmod: true,
  },

  ogImage: {
    zeroRuntime: true,
    security: {
      renderTimeout: 60000,
    },
  },

  fonts: {
    families: [
      {
        name: "Noto Sans TC",
        src: "/fonts/NotoSansTC-VariableFont_wght.woff2",
        weights: [400, 700],
        global: true,
      },
    ],
  },
});
