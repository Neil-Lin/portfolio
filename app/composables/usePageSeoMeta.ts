interface PageSeoOptions {
  /** 覆寫正規網址；預設由目前路由推導（帶尾斜線）。 */
  url?: Ref<string> | ComputedRef<string>;
  /**
   * 是否自動產生 OG 圖（CustomTemplate）。預設 true。
   * 自行處理 OG 圖的頁面（文章頁、產品詳情頁）傳 false。
   * 於 setup 期求值，與先前各頁自己寫 if 判斷的時機相同。
   */
  ogImage?: boolean;
}

export function usePageSeoMeta(
  title: Ref<string> | ComputedRef<string>,
  description: Ref<string> | ComputedRef<string>,
  options: PageSeoOptions = {},
) {
  const { t } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();

  const resolvedUrl =
    options.url ??
    computed(() =>
      absoluteUrl(runtimeConfig.public.baseUrl as string, route.path),
    );

  const socialTitle = computed(() => `${title.value} - ${t("website.name")}`);

  // 不輸出 twitter:title / twitter:description / twitter:url：
  // X 找不到 twitter:* 時會自動退回 og:*，這三個純粹是重複資料，
  // 而 twitter:url 根本不是有效的 meta 名稱（unhead 會警告 Unknown meta name）。
  // 只有 twitter:card 有實際作用（決定卡片版型），留在 layout。
  useHead(
    computed(() => ({
      title: title.value,
      meta: [
        { name: "description", content: description.value },
        { property: "og:url", content: resolvedUrl.value },
        { property: "og:title", content: socialTitle.value },
        { property: "og:description", content: description.value },
      ],
    })),
  );

  // OG 圖：先前五個頁面各自寫了一模一樣的一段，集中在這裡。
  if (options.ogImage !== false) {
    defineOgImage("CustomTemplate", {
      title: socialTitle.value,
      description: description.value,
    });
  }
}
