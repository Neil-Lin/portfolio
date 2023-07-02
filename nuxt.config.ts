// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/portfolio/',
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: ['@vite-pwa/nuxt'],
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
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      websiteName: process.env.WEBSITE_NAME || '網站名稱',
      websiteDescription: process.env.WEBSITE_DESCRIPTION || '網站描述'
    }
  },
  typescript: {
    typeCheck: true
  }
})
