// 各語言的站台根網址，**不帶尾斜線**：全站約 25 處都以 `${orgUrl}/xxx` 的形式串接，
// 這裡當作「串接用的前綴」而非可直接使用的頁面網址。
// 若要當成頁面網址輸出（例如 schema.org 的 url 欄位），請自行套 withTrailingSlash()。
export function useOrgUrl() {
  const { locale } = useI18n();
  const runtimeConfig = useRuntimeConfig();

  return computed(() =>
    locale.value === "en"
      ? `${runtimeConfig.public.baseUrl}/en`
      : `${runtimeConfig.public.baseUrl}`,
  );
}
