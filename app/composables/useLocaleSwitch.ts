type LocaleCode = "zh-Hant-TW" | "en";

// 統一解析語言切換目標：
// 1. 部落格文章頁、有對照版 → 對照版
// 2. 部落格文章頁、沒有對照版 → 該語言的 blog 首頁（避免算出不存在的跨語言網址而 404）
// 3. 其他頁面 → 沿用 switchLocalePath 預設行為
export async function useLocaleSwitch() {
  // 其他 composable 都要在 await 之前呼叫：await 之後就拿不到 Nuxt 的執行環境（E1001）
  const switchLocalePath = useSwitchLocalePath();
  const { locale } = useI18n();
  const route = useRoute();
  const counterpart = await useBlogCounterpart();

  const resolve = (code: LocaleCode) => {
    const isArticle = /^\/(en\/)?blog\/.+/.test(route.path);
    if (!isArticle || code === locale.value) return switchLocalePath(code);
    if (counterpart.value) return counterpart.value;
    return code === "en" ? "/en/blog/" : "/blog/";
  };

  return { resolve };
}
