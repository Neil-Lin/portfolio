export default defineI18nConfig(() => ({
  legacy: false,
  locale: "zh-Hant-TW",
  fallbackLocale: ["en", "zh-Hant-TW"],
  // nuxt-seo-utils 的備用標題會查 pages.<路由名稱>.title，這個專案沒有這些字串（標題都自己設定），
  // 查不到時 vue-i18n 會一直警告「Fall back to translate」。只關掉 pages.* 的警告，其他漏翻譯照常提醒。
  fallbackWarn: /^(?!pages\.)/,
}));
