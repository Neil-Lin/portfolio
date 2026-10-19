// 範例元件的中英文字串：依目前語系回傳對應的那一組
export function useDemoText<M extends { en: unknown; "zh-Hant-TW": unknown }>(
  messages: M,
) {
  const { locale } = useI18n();
  return computed<M["en"] | M["zh-Hant-TW"]>(() =>
    locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
  );
}
