export default defineI18nConfig(() => ({
  legacy: false,
  locale: "zh-Hant-TW",
  fallbackLocale: ["en", "zh-Hant-TW"],
  messages: (() => {
    const messages = import.meta.glob("~/i18n/lang/*.json", {
      eager: true,
    }) as Record<string, { default: Record<string, string> }>;
    return {
      "zh-Hant-TW": messages["/lang/zh-Hant-TW.json"]?.default ?? {},
      en: messages["/lang/en-US.json"]?.default ?? {},
    };
  })(),
}));
