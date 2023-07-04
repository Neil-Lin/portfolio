// https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/
export const datetimeFormats = {
  "zh-Hant-TW": {
    // 👇 Give a key for each format...
    short: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    // We can have as many formats here as
    // want e.g. long, footer_copyright, etc.
  },
  "en-US": {
    // 👇 ...use the same keys for each locale
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  },
} as const // 👈 Cast to avoid TypeScript errors