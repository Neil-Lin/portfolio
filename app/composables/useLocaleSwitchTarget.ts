type LocaleCode = "zh-Hant-TW" | "en";

// 讓特定頁面（如文章）覆寫語言切換鈕的目標路徑。
// 預設 null；文章頁設成 { [另一語言]: 對照版路徑 }（精確指向，client 端 hydration 後生效）。
export function useLocaleSwitchTarget() {
  return useState<Record<string, string> | null>(
    "localeSwitchOverride",
    () => null,
  );
}

// 統一解析語言切換目標：
// 1. 有頁面覆寫 → 用覆寫（精確對照版）
// 2. 在部落格文章頁 → 同步退回「該語言 blog 首頁」（避免 SSR 算出不存在的跨語言鏡像網址而 404）
// 3. 其他頁面 → 沿用 switchLocalePath 預設行為
export function useLocaleSwitch() {
  const override = useLocaleSwitchTarget();
  const switchLocalePath = useSwitchLocalePath();
  const route = useRoute();

  const resolve = (code: LocaleCode) => {
    if (override.value?.[code]) return override.value[code];
    if (/^\/(en\/)?blog\/.+/.test(route.path)) {
      return code === "en" ? "/en/blog" : "/blog";
    }
    return switchLocalePath(code);
  };

  return { resolve };
}
