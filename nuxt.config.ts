import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: [
    '@/assets/scss/style.scss',
  ],
  router: {
    base: process.env.DEPLOY_ENV === 'GH_PAGES' ? '/portfolio/.output/' : '/'
  }
})
